import type { Node as ProseMirrorNode } from "prosemirror-model";
import { TextSelection } from "prosemirror-state";
import {
	DecorationSet,
	type EditorView,
	type NodeView,
} from "prosemirror-view";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { stubMathJaxRuntime } from "../../test-helpers/mathjax.js";
import { required } from "../../test-helpers/required.js";

import "./prose-editor.js";

Range.prototype.getClientRects = (): DOMRectList =>
	({
		item: () => null,
		length: 0,
		[Symbol.iterator]: function* (): IterableIterator<DOMRect> {},
	}) as unknown as DOMRectList;
Range.prototype.getBoundingClientRect = (): DOMRect => ({
	bottom: 0,
	height: 0,
	left: 0,
	right: 0,
	top: 0,
	width: 0,
	x: 0,
	y: 0,
	toJSON: () => ({}),
});

async function flush(): Promise<void> {
	for (let index = 0; index < 8; index += 1) {
		await Promise.resolve();
	}
	await new Promise((resolve) => {
		setTimeout(resolve, 0);
	});
}

async function waitFor(
	predicate: () => boolean,
	timeout = 10_000,
): Promise<void> {
	const start = Date.now();

	while (!predicate()) {
		if (Date.now() - start > timeout) {
			throw new Error("Timed out waiting for the editor state");
		}

		await new Promise((resolve) => {
			setTimeout(resolve, 10);
		});
	}
}

function getEditor(): HTMLElement & {
	focus: () => void;
	getHTML: () => string;
	insertTable: (rows?: number, columns?: number) => boolean;
	setHTML: (value: string) => void;
	value: string;
} {
	const editor = document.querySelector("tp-prose-editor");

	if (editor === null) {
		throw new Error("tp-prose-editor not found");
	}

	return editor as HTMLElement & {
		focus: () => void;
		getHTML: () => string;
		insertTable: (rows?: number, columns?: number) => boolean;
		setHTML: (value: string) => void;
		value: string;
	};
}

type TpCodeEditorTestElement = HTMLElement & {
	getValue: () => string;
	setValue: (value: string) => void;
};

function stubMathJax(): ReturnType<typeof vi.fn> {
	const tex2svgPromise = vi.fn(async (tex: string) => {
		const element = document.createElement("mjx-container");
		element.dataset.testMathjax = tex;
		return element;
	});

	vi.stubGlobal("MathJax", {
		startup: {
			promise: Promise.resolve(),
		},
		tex2svgPromise,
	});

	return tex2svgPromise;
}

function setCursor(editor: HTMLElement, position: number): void {
	const view = (editor as unknown as { editorView: EditorView }).editorView;
	view.dispatch(
		view.state.tr.setSelection(TextSelection.create(view.state.doc, position)),
	);
}

function selectRange(editor: HTMLElement, from: number, to: number): void {
	const view = (editor as unknown as { editorView: EditorView }).editorView;
	view.dispatch(
		view.state.tr.setSelection(TextSelection.create(view.state.doc, from, to)),
	);
}

function selectMenuCommand(editor: HTMLElement, command: string): void {
	const item = editor.querySelector<HTMLElement>(
		`li[data-menu-command="${command}"]`,
	);

	if (item === null) {
		throw new Error(`Menu command not found: ${command}`);
	}

	item.dispatchEvent(
		new CustomEvent("tp-menu-item-select", {
			bubbles: true,
			detail: { item },
		}),
	);
}

function selectTableAction(editor: HTMLElement, action: string): void {
	const item = editor.querySelector<HTMLElement>(
		`li[data-table-action="${action}"]`,
	);

	if (item === null) {
		throw new Error(`Table action not found: ${action}`);
	}

	item.dispatchEvent(
		new CustomEvent("tp-menu-item-select", {
			bubbles: true,
			detail: { item },
		}),
	);
}

async function submitMediaAttributeDialog(
	editor: HTMLElement,
	options: {
		alt?: string;
		autoplay?: boolean;
		caption?: string;
		controls?: boolean;
		height?: string;
		poster?: string;
		title?: string;
		width?: string;
	} = {},
): Promise<void> {
	await waitFor(() => editor.querySelector("dialog") !== null);
	const dialog = editor.querySelector("dialog");

	if (!(dialog instanceof HTMLElement)) {
		throw new Error("Media attribute dialog not found");
	}

	if (dialog.querySelector("tp-checkbox-list") !== null) {
		await waitFor(
			() =>
				dialog.querySelector('tp-checkbox-list input[type="checkbox"]') !==
				null,
		);
	}

	if (options.title !== undefined) {
		const input = dialog.querySelector<HTMLInputElement>('input[name="title"]');

		if (input === null) {
			throw new Error("Title input not found");
		}

		input.value = options.title;
	}

	if (options.alt !== undefined) {
		const input = dialog.querySelector<HTMLInputElement>('input[name="alt"]');

		if (input === null) {
			throw new Error("Alternative text input not found");
		}

		input.value = options.alt;
	}

	if (options.poster !== undefined) {
		const input = dialog.querySelector<HTMLInputElement>(
			'input[name="poster"]',
		);

		if (input === null) {
			throw new Error("Poster input not found");
		}

		input.value = options.poster;
	}

	if (options.caption !== undefined) {
		const input = dialog.querySelector<HTMLInputElement>(
			'input[name="caption"]',
		);

		if (input === null) {
			throw new Error("Caption input not found");
		}

		input.value = options.caption;
	}

	if (options.width !== undefined) {
		const input = dialog.querySelector<HTMLInputElement>('input[name="width"]');

		if (input === null) {
			throw new Error("Width input not found");
		}

		input.value = options.width;
		input.dispatchEvent(new Event("input", { bubbles: true }));
	}

	if (options.height !== undefined) {
		const input = dialog.querySelector<HTMLInputElement>(
			'input[name="height"]',
		);

		if (input === null) {
			throw new Error("Height input not found");
		}

		input.value = options.height;
		input.dispatchEvent(new Event("input", { bubbles: true }));
	}

	if (options.autoplay === true || options.controls !== undefined) {
		const checkboxList = dialog.querySelector("tp-checkbox-list");

		if (checkboxList === null) {
			throw new Error("Media attribute checkbox list not found");
		}

		const selectedIndexes = Array.from(
			dialog.querySelectorAll<HTMLElement>(
				"tp-checkbox-list li[data-media-option]",
			),
		).flatMap((item, index) => {
			const option = item.dataset.mediaOption;

			if (option === "controls" && options.controls !== false) {
				return [String(index + 1)];
			}

			if (option === "autoplay" && options.autoplay === true) {
				return [String(index + 1)];
			}

			if (option === "lock-ratio") {
				return [String(index + 1)];
			}

			return [];
		});

		checkboxList.setAttribute("value", selectedIndexes.join(","));
		await flush();
	}

	dialog.querySelector<HTMLButtonElement>('button[value="ok"]')?.click();
	await waitFor(() => editor.querySelector("dialog") === null);
}

describe("<tp-prose-editor>", () => {
	beforeEach(() => {
		// jsdom has no layout; CodeMirror measurements belong to browser tests.
		vi.stubGlobal(
			"requestAnimationFrame",
			vi.fn(() => 0),
		);
		stubMathJaxRuntime();
	});
	afterEach(() => {
		document.body.innerHTML = "";
		vi.restoreAllMocks();
		vi.unstubAllGlobals();
	});

	it("est défini", () => {
		expect(customElements.get("tp-prose-editor")).toBeDefined();
	});

	it("crée la barre d’outils et la surface ProseMirror", async () => {
		document.body.innerHTML = "<tp-prose-editor></tp-prose-editor>";
		await flush();

		const editor = getEditor();

		expect(
			editor.querySelector(":scope > tp-toolbar[data-tp-prose-editor-toolbar]"),
		).toBeTruthy();
		expect(editor.querySelector('tp-icon-button[name="file"]')).toBeTruthy();
		expect(
			editor.querySelector('tp-icon-button[name="format-title"]'),
		).toBeTruthy();
		expect(
			editor.querySelector('tp-icon-button[name="letter-f"]'),
		).toBeTruthy();
		expect(
			editor.querySelector('tp-icon-button[name="list-down"]'),
		).toBeTruthy();
		expect(editor.querySelector('tp-icon-button[name="table"]')).toBeTruthy();
		expect(
			editor.querySelector('tp-icon-button[name="multimedia"]'),
		).toBeTruthy();
		expect(
			editor.querySelector('li[data-menu-command="insert-markup-asciidoc"]')
				?.textContent,
		).toContain("AsciiDoc");
		expect(
			editor.querySelector('li[data-menu-command="insert-markup-html"]')
				?.textContent,
		).toContain("HTML");
		expect(
			editor.querySelector('li[data-menu-command="insert-markup-markdown"]')
				?.textContent,
		).toContain("Markdown");
		expect(
			editor.querySelector(
				'li[data-menu-command="insert-markup-restructuredtext"]',
			)?.textContent,
		).toContain("reStructuredText");
		for (const command of [
			"insert-markup-asciidoc",
			"insert-markup-html",
			"insert-markup-markdown",
			"insert-markup-restructuredtext",
		]) {
			expect(
				editor.querySelector(
					`li[data-menu-command="${command}"] tp-icon[library="languages"]`,
				),
			).not.toBeNull();
		}
		expect(
			editor.querySelector('tp-icon-button[name="emoticon-happy-outline"]'),
		).toBeTruthy();
		expect(editor.querySelector('tp-icon-button[name="shapes"]')).toBeTruthy();
		expect(editor.querySelector('tp-icon-button[name="symbol"]')).toBeTruthy();
		expect(editor.querySelector("tp-emoji-picker[compact]")).toBeTruthy();
		expect(editor.querySelector("tp-icon-picker[compact]")).toBeTruthy();
		expect(editor.querySelector("tp-symbol-picker[compact]")).toBeTruthy();
		expect(editor.querySelector('tp-icon-button[name="copy"]')).toBeTruthy();
		expect(editor.querySelector('tp-icon-button[name="cut"]')).toBeTruthy();
		expect(editor.querySelector('tp-icon-button[name="paste"]')).toBeTruthy();
		expect(
			editor.querySelector('tp-icon-button[name="select-all"]'),
		).toBeTruthy();
		expect(
			editor.querySelector('tp-icon-button[name="language-html"]'),
		).toBeTruthy();
		expect(editor.querySelector('tp-icon-button[name="search"]')).toBeTruthy();
		expect(
			editor.querySelector(
				'tp-icon-button[name="dots-vertical"][section="end"]',
			),
		).toBeTruthy();
		expect(
			editor
				.querySelector('tp-fullscreen[section="end"]')
				?.getAttribute("anchor"),
		).toBe(`#${editor.id}`);
		expect(
			editor
				.querySelector('tp-icon-button[name="file"]')
				?.getAttribute("section"),
		).toBe("start");
		expect(
			editor
				.querySelector('tp-icon-button[name="undo"]')
				?.getAttribute("section"),
		).toBe("center");
		expect(
			editor
				.querySelector('tp-icon-button[name="language-html"]')
				?.getAttribute("section"),
		).toBe("center");
		expect(
			editor.querySelector(
				'[data-tp-prose-editor-toolbar] [data-tp-prose-editor-center-boundary="start"]',
			),
		).toBeTruthy();
		expect(
			editor.querySelector(
				'[data-tp-prose-editor-toolbar] [data-tp-prose-editor-center-boundary="end"]',
			),
		).toBeTruthy();
		expect(
			editor
				.querySelector('tp-icon-button[name="search"]')
				?.getAttribute("section"),
		).toBe("end");
		expect(
			editor
				.querySelector("[data-tp-prose-editor-search-control]")
				?.getAttribute("section"),
		).toBe("end");
		expect(
			editor.querySelector(
				":scope > tp-toolbar[data-tp-prose-editor-secondary-toolbar]",
			),
		).toBeTruthy();
		expect(
			editor
				.querySelector(
					":scope > tp-toolbar[data-tp-prose-editor-secondary-toolbar]",
				)
				?.hasAttribute("hidden"),
		).toBe(true);
		expect(
			editor.querySelector('tp-color[section="end"]')?.getAttribute("anchor"),
		).toBe(`#${editor.id}`);
		expect(
			editor.querySelector('tp-theme[section="end"]')?.getAttribute("anchor"),
		).toBe(`#${editor.id}`);
		expect(editor.hasAttribute("data-tp-color-scope")).toBe(true);
		expect(editor.hasAttribute("data-tp-theme-scope")).toBe(true);
		expect(
			editor.querySelector("[data-tp-prose-editor-file-dropdown]"),
		).toBeTruthy();
		expect(
			editor.querySelector("[data-tp-prose-editor-type-dropdown]"),
		).toBeTruthy();
		expect(
			editor.querySelector("[data-tp-prose-editor-format-dropdown]"),
		).toBeTruthy();
		expect(
			editor.querySelector("[data-tp-prose-editor-list-dropdown]"),
		).toBeTruthy();
		expect(
			editor.querySelector("[data-tp-prose-editor-media-dropdown]"),
		).toBeTruthy();
		expect(
			editor.querySelector("[data-tp-prose-editor-html-dropdown]"),
		).toBeTruthy();
		expect(editor.querySelector('li[data-html-action="editor"]')).toBeTruthy();
		expect(
			editor
				.querySelector('li[data-menu-command="format-underline"]')
				?.hasAttribute("aria-disabled"),
		).toBe(false);
		expect(
			editor.querySelector(":scope > [data-tp-prose-editor-surface]"),
		).toBeTruthy();
		expect(
			editor.querySelector(":scope > [data-tp-prose-editor-html-source]"),
		).toBeTruthy();
		expect(
			editor.querySelector(":scope > [data-tp-prose-editor-html-rendered]"),
		).toBeTruthy();
		expect(editor.querySelector(".ProseMirror")).toBeTruthy();
	});

	it("affiche un placeholder configurable lorsque le document est vide", async () => {
		document.body.innerHTML =
			'<tp-prose-editor placeholder="Write here..."></tp-prose-editor>';
		await flush();
		const editor = getEditor();
		const proseMirror = editor.querySelector<HTMLElement>(".ProseMirror");

		expect(proseMirror?.dataset.placeholder).toBe("Write here...");
		expect(proseMirror?.hasAttribute("data-tp-prose-editor-empty")).toBe(true);

		editor.setHTML("<p>Content</p>");
		expect(proseMirror?.hasAttribute("data-tp-prose-editor-empty")).toBe(false);

		editor.setHTML("");
		editor.setAttribute("placeholder", "Type your prose...");
		expect(proseMirror?.dataset.placeholder).toBe("Type your prose...");
		expect(proseMirror?.hasAttribute("data-tp-prose-editor-empty")).toBe(true);
	});

	it("insère les éléments sélectionnés dans les trois pickers", async () => {
		document.body.innerHTML =
			"<tp-prose-editor><p>Start </p></tp-prose-editor>";
		await flush();
		const editor = getEditor();

		editor.querySelector("tp-emoji-picker")?.dispatchEvent(
			new CustomEvent("tp-emoji-picker-select", {
				bubbles: true,
				detail: { value: "🙂" },
			}),
		);
		editor.querySelector("tp-symbol-picker")?.dispatchEvent(
			new CustomEvent("tp-symbol-picker-select", {
				bubbles: true,
				detail: { value: "∞" },
			}),
		);
		editor.querySelector("tp-icon-picker")?.dispatchEvent(
			new CustomEvent("tp-icon-picker-select", {
				bubbles: true,
				detail: { value: '<tp-icon name="logo-tp" size="1em"></tp-icon>' },
			}),
		);

		expect(editor.getHTML()).toContain("🙂∞");
		const insertedIcon = editor.querySelector(
			'.ProseMirror p > tp-icon[name="logo-tp"]',
		);
		expect(insertedIcon).not.toBeNull();
		expect(insertedIcon?.parentElement?.textContent).toContain("Start");
		expect(insertedIcon?.nextSibling?.textContent?.startsWith("\u200B")).toBe(
			true,
		);
		expect(editor.getHTML()).not.toContain("\u200B");
	});

	it("affiche la toolbar secondaire depuis le bouton more", async () => {
		document.body.innerHTML = "<tp-prose-editor><p>Hello</p></tp-prose-editor>";
		await flush();

		const editor = getEditor();
		const moreButton = editor.querySelector<HTMLElement>(
			'tp-icon-button[data-command="more"]',
		);
		const secondaryToolbar = editor.querySelector<HTMLElement>(
			"[data-tp-prose-editor-secondary-toolbar]",
		);

		moreButton?.click();

		expect(secondaryToolbar?.hidden).toBe(false);
		expect(moreButton?.getAttribute("aria-pressed")).toBe("true");
		expect(
			secondaryToolbar?.querySelector(
				'tp-icon-button[data-command="format-text"]',
			),
		).toBeTruthy();
		expect(
			secondaryToolbar
				?.querySelector('tp-icon-button[data-command="format-text"]')
				?.getAttribute("section"),
		).toBe("start");
		expect(
			secondaryToolbar?.querySelector(
				'[data-tp-prose-editor-center-boundary="start"]',
			),
		).toBeTruthy();
		expect(
			secondaryToolbar?.querySelector(
				'[data-tp-prose-editor-center-boundary="end"]',
			),
		).toBeTruthy();
		expect(
			secondaryToolbar?.querySelector(
				'tp-icon-button[data-command="format-header-1"]',
			),
		).toBeTruthy();
		expect(
			secondaryToolbar?.querySelector(
				'tp-icon-button[data-command="format-header-2"]',
			),
		).toBeTruthy();
		expect(
			secondaryToolbar?.querySelector(
				'tp-icon-button[data-command="format-header-3"]',
			),
		).toBeTruthy();
		expect(
			secondaryToolbar?.querySelector(
				'tp-icon-button[data-command="format-header-4"]',
			),
		).toBeNull();
		expect(
			secondaryToolbar?.querySelector(
				'tp-icon-button[data-command="format-list-bulleted"]',
			),
		).toBeTruthy();
		expect(
			secondaryToolbar
				?.querySelector('tp-icon-button[data-command="format-list-bulleted"]')
				?.getAttribute("section"),
		).toBe("center");
		expect(
			secondaryToolbar?.querySelector(
				'tp-icon-button[data-command="format-list-numbered"]',
			),
		).toBeTruthy();
		expect(
			secondaryToolbar?.querySelector(
				'tp-icon-button[data-command="format-list-text"]',
			),
		).toBeTruthy();
		expect(
			secondaryToolbar?.querySelector(
				'tp-icon-button[data-command="insert-image"]',
			),
		).toBeTruthy();
		expect(
			secondaryToolbar?.querySelector(
				'tp-icon-button[data-command="insert-video"]',
			),
		).toBeTruthy();
		expect(
			secondaryToolbar?.querySelector(
				'tp-icon-button[data-command="insert-audio"]',
			),
		).toBeTruthy();
		expect(
			secondaryToolbar?.querySelector(
				'tp-icon-button[data-command="format-bold"]',
			),
		).toBeTruthy();
		expect(
			secondaryToolbar
				?.querySelector('tp-icon-button[data-command="format-bold"]')
				?.getAttribute("section"),
		).toBe("end");

		moreButton?.click();

		expect(secondaryToolbar?.hidden).toBe(true);
		expect(moreButton?.getAttribute("aria-pressed")).toBe("false");
	});

	it("active les boutons heading de la toolbar secondaire comme des toggles", async () => {
		document.body.innerHTML = "<tp-prose-editor><p>Hello</p></tp-prose-editor>";
		await flush();

		const editor = getEditor();
		const moreButton = editor.querySelector<HTMLElement>(
			'tp-icon-button[data-command="more"]',
		);
		const h1Button = editor.querySelector<HTMLElement>(
			'[data-tp-prose-editor-secondary-toolbar] tp-icon-button[data-command="format-header-1"]',
		);
		const h2Button = editor.querySelector<HTMLElement>(
			'[data-tp-prose-editor-secondary-toolbar] tp-icon-button[data-command="format-header-2"]',
		);

		moreButton?.click();
		h1Button?.click();

		expect(editor.getHTML()).toBe("<h1>Hello</h1>");
		expect(h1Button?.getAttribute("aria-pressed")).toBe("true");
		expect(
			h1Button?.querySelector("button")?.getAttribute("aria-pressed"),
		).toBe("true");
		expect(h2Button?.getAttribute("aria-pressed")).toBe("false");
		expect(
			h2Button?.querySelector("button")?.getAttribute("aria-pressed"),
		).toBe("false");

		h1Button?.click();

		expect(editor.getHTML()).toBe("<p>Hello</p>");
		expect(h1Button?.getAttribute("aria-pressed")).toBe("false");
		expect(
			h1Button?.querySelector("button")?.getAttribute("aria-pressed"),
		).toBe("false");
	});

	it("change l’icône fullscreen quand l’éditeur est en plein écran", async () => {
		document.body.innerHTML = "<tp-prose-editor><p>Hello</p></tp-prose-editor>";
		await flush();

		const editor = getEditor();
		const fullscreenButton = editor.querySelector<HTMLElement>(
			"tp-fullscreen > tp-icon-button",
		);
		let fullscreenElement: Element | null = null;

		Object.defineProperty(document, "fullscreenElement", {
			configurable: true,
			get: () => fullscreenElement,
		});
		Object.defineProperty(editor, "requestFullscreen", {
			configurable: true,
			value: vi.fn(async () => {
				fullscreenElement = editor;
				document.dispatchEvent(new Event("fullscreenchange"));
			}),
		});
		Object.defineProperty(document, "exitFullscreen", {
			configurable: true,
			value: vi.fn(async () => {
				fullscreenElement = null;
				document.dispatchEvent(new Event("fullscreenchange"));
			}),
		});

		fullscreenButton?.click();
		await flush();

		expect(fullscreenButton?.getAttribute("name")).toBe("fullscreen-exit");
		expect(fullscreenButton?.getAttribute("aria-pressed")).toBe("true");

		fullscreenButton?.click();
		await flush();

		expect(fullscreenButton?.getAttribute("name")).toBe("fullscreen");
		expect(fullscreenButton?.getAttribute("aria-pressed")).toBe("false");
	});

	it("empêche le mousedown du bouton HTML de sélectionner le contenu", async () => {
		document.body.innerHTML = "<tp-prose-editor><p>Hello</p></tp-prose-editor>";
		await flush();

		const editor = getEditor();
		const htmlButton = editor.querySelector<HTMLElement>(
			'tp-icon-button[name="language-html"]',
		);
		const event = new MouseEvent("mousedown", {
			bubbles: true,
			cancelable: true,
		});

		htmlButton?.dispatchEvent(event);

		expect(event.defaultPrevented).toBe(true);
	});

	it("utilise le contenu HTML initial comme document éditable", async () => {
		document.body.innerHTML =
			"<tp-prose-editor><h1>Hello</h1><p>World</p></tp-prose-editor>";
		await flush();

		expect(getEditor().getHTML()).toBe("<h1>Hello</h1><p>World</p>");
	});

	it("préserve les marques underline, strikethrough, subscript et superscript", async () => {
		document.body.innerHTML = [
			"<tp-prose-editor>",
			"<p><u>Under</u> <s>Strike</s> <sub>Sub</sub> <sup>Sup</sup></p>",
			"</tp-prose-editor>",
		].join("");
		await flush();

		expect(getEditor().getHTML()).toBe(
			"<p><u>Under</u> <s>Strike</s> <sub>Sub</sub> <sup>Sup</sup></p>",
		);
	});

	it("préserve les nœuds video et audio", async () => {
		document.body.innerHTML = [
			"<tp-prose-editor>",
			'<p><img src="/media/demo.png" alt="Demo image" title="Image" width="320" height="240"></p>',
			'<figure><video src="/media/demo.mp4" controls autoplay poster="/media/poster.jpg" title="Demo" width="640" height="360"></video><figcaption>Video caption</figcaption></figure>',
			'<figure><audio src="/media/demo.mp3" controls autoplay title="Audio"></audio><figcaption>Audio caption</figcaption></figure>',
			"</tp-prose-editor>",
		].join("");
		await flush();

		expect(getEditor().getHTML()).toBe(
			'<figure><img src="/media/demo.png" alt="Demo image" title="Image" width="320" height="240"><figcaption>Demo image</figcaption></figure><figure><video src="/media/demo.mp4" autoplay="" controls="" poster="/media/poster.jpg" title="Demo" width="640" height="360"></video><figcaption>Video caption</figcaption></figure><figure><audio src="/media/demo.mp3" autoplay="" controls="" title="Audio"></audio><figcaption>Audio caption</figcaption></figure>',
		);
	});

	it("préserve les listes de définitions", async () => {
		document.body.innerHTML = [
			"<tp-prose-editor>",
			"<dl>",
			"<dt>Term</dt>",
			"<dd><p>Definition</p></dd>",
			"</dl>",
			"</tp-prose-editor>",
		].join("");
		await flush();

		expect(getEditor().getHTML()).toBe(
			"<dl><dt>Term</dt><dd><p>Definition</p></dd></dl>",
		);
	});

	it("crée un nouvel item de liste avec Enter", async () => {
		document.body.innerHTML =
			"<tp-prose-editor><ul><li><p>One</p></li></ul></tp-prose-editor>";
		await flush();

		const editor = getEditor();
		const view = (editor as unknown as { editorView: EditorView }).editorView;
		let cursorPosition = 0;

		view.state.doc.descendants((node, position) => {
			if (node.isText && node.text === "One") {
				cursorPosition = position + node.nodeSize;
			}
		});
		view.dispatch(
			view.state.tr.setSelection(
				TextSelection.create(view.state.doc, cursorPosition),
			),
		);

		const handled = view.someProp("handleKeyDown", (handler) =>
			handler(view, new KeyboardEvent("keydown", { key: "Enter" })),
		);

		expect(handled).toBe(true);
		expect(editor.getHTML()).toBe(
			"<ul><li><p>One</p></li><li><p></p></li></ul>",
		);
	});

	it("crée un nouveau couple term/description avec Enter en fin de description", async () => {
		document.body.innerHTML =
			"<tp-prose-editor><dl><dt>Term 1</dt><dd><p>Description 1</p></dd></dl></tp-prose-editor>";
		await flush();

		const editor = getEditor();
		const view = (editor as unknown as { editorView: EditorView }).editorView;
		let cursorPosition = 0;

		view.state.doc.descendants((node, position) => {
			if (node.isText && node.text === "Description 1") {
				cursorPosition = position + node.nodeSize;
			}
		});
		view.dispatch(
			view.state.tr.setSelection(
				TextSelection.create(view.state.doc, cursorPosition),
			),
		);

		const pressEnter = (): boolean =>
			Boolean(
				view.someProp("handleKeyDown", (handler) =>
					handler(view, new KeyboardEvent("keydown", { key: "Enter" })),
				),
			);
		const handled = pressEnter();

		expect(handled).toBe(true);
		expect(editor.getHTML()).toBe(
			"<dl><dt>Term 1</dt><dd><p>Description 1</p></dd><dt>Term</dt><dd><p>Description</p></dd></dl>",
		);
		expect(
			view.state.doc.textBetween(
				view.state.selection.from,
				view.state.selection.to,
			),
		).toBe("Term");

		const exitHandled = pressEnter();

		expect(exitHandled).toBe(true);
		expect(editor.getHTML()).toBe(
			"<dl><dt>Term 1</dt><dd><p>Description 1</p></dd></dl>",
		);
		expect(view.state.selection.$from.parent.type.name).toBe("paragraph");
		expect(view.state.selection.empty).toBe(true);
	});

	it("préserve et rend les formules MathJax inline et block", async () => {
		const tex2svgPromise = stubMathJax();
		document.body.innerHTML = [
			"<tp-prose-editor>",
			'<p>Inline <span data-tp-prose-editor-math-inline data-mathjax-tex="E = mc^2" data-mathjax-display="false"></span></p>',
			'<div data-tp-prose-editor-math-block data-mathjax-tex="x^2" data-mathjax-display="true"></div>',
			"</tp-prose-editor>",
		].join("");
		await waitFor(() => tex2svgPromise.mock.calls.length >= 2);

		const html = getEditor().getHTML();
		expect(html).toContain('data-tp-prose-editor-math-inline=""');
		expect(html).toContain('data-mathjax-tex="E = mc^2"');
		expect(html).toContain('data-tp-prose-editor-math-block=""');
		expect(html).toContain('data-mathjax-tex="x^2"');
		expect(tex2svgPromise).toHaveBeenCalledWith("E = mc^2", { display: false });
		expect(tex2svgPromise).toHaveBeenCalledWith("x^2", { display: true });
	});

	it("convertit la sélection en formule MathJax inline depuis le menu format", async () => {
		stubMathJax();
		document.body.innerHTML =
			"<tp-prose-editor><p>Inline E = mc^2</p></tp-prose-editor>";
		await flush();

		const editor = getEditor();
		selectRange(editor, 8, 16);
		selectMenuCommand(editor, "format-math");

		expect(editor.getHTML()).toContain('data-tp-prose-editor-math-inline=""');
		expect(editor.getHTML()).toContain('data-mathjax-tex="E = mc^2"');
	});

	it("ne convertit pas automatiquement les délimiteurs $...$", async () => {
		stubMathJax();
		document.body.innerHTML =
			"<tp-prose-editor><p>$E =2,72 $</p></tp-prose-editor>";
		await flush();

		const editor = getEditor();
		expect(editor.getHTML()).toBe("<p>$E =2,72 $</p>");
		expect(editor.getHTML()).not.toContain("data-tp-prose-editor-math-inline");
	});

	it("convertit la sélection en bloc MathJax depuis le menu types", async () => {
		stubMathJax();
		document.body.innerHTML =
			"<tp-prose-editor><p>E = mc^2</p></tp-prose-editor>";
		await flush();

		const editor = getEditor();
		const view = (editor as unknown as { editorView: EditorView }).editorView;
		selectRange(editor, 1, 9);
		selectMenuCommand(editor, "insert-math-block");

		expect(editor.getHTML()).toContain('data-tp-prose-editor-math-block=""');
		expect(editor.getHTML()).toContain('data-mathjax-tex="E = mc^2"');
		expect(view.state.selection.$from.parent.type.name).toBe("paragraph");
		expect(view.state.selection.empty).toBe(true);
	});

	it("positionne le curseur sans sélectionner le contenu après un bloc MathJax", async () => {
		stubMathJax();
		document.body.innerHTML =
			"<tp-prose-editor><p>E = mc^2</p><p>After</p></tp-prose-editor>";
		await flush();

		const editor = getEditor();
		const view = (editor as unknown as { editorView: EditorView }).editorView;
		selectRange(editor, 1, 9);
		selectMenuCommand(editor, "insert-math-block");

		expect(editor.getHTML()).toContain("<p>After</p>");
		expect(view.state.selection.$from.parent.type.name).toBe("paragraph");
		expect(view.state.selection.empty).toBe(true);
		expect(
			view.state.doc.textBetween(
				view.state.selection.from,
				view.state.selection.to,
			),
		).toBe("");
	});

	it("applique les marques supplémentaires depuis le menu format", async () => {
		document.body.innerHTML = "<tp-prose-editor><p>Marks</p></tp-prose-editor>";
		await flush();

		const editor = getEditor();
		const cases = [
			["format-underline", "<p><u>Marks</u></p>"],
			["format-strikethrough", "<p><s>Marks</s></p>"],
			["format-subscript", "<p><sub>Marks</sub></p>"],
			["format-superscript", "<p><sup>Marks</sup></p>"],
		] as const;

		for (const [command, expectedHTML] of cases) {
			editor.setHTML("<p>Marks</p>");
			selectRange(editor, 1, 6);
			selectMenuCommand(editor, command);

			expect(editor.getHTML()).toBe(expectedHTML);
		}
	});

	it("insère une liste de définitions depuis le menu list", async () => {
		document.body.innerHTML =
			"<tp-prose-editor><p>Glossary</p></tp-prose-editor>";
		await flush();

		const editor = getEditor();
		selectRange(editor, 1, 9);
		selectMenuCommand(editor, "format-list-text");

		const view = (editor as unknown as { editorView: EditorView }).editorView;
		expect(editor.getHTML()).toBe(
			"<dl><dt>Glossary</dt><dd><p>Description</p></dd></dl>",
		);
		expect(view.state.selection.$from.parent.type.name).toBe("paragraph");
		expect(
			view.state.selection.$from.node(view.state.selection.$from.depth - 1).type
				.name,
		).toBe("definition_description");
		expect(
			view.state.doc.textBetween(
				view.state.selection.from,
				view.state.selection.to,
			),
		).toBe("Description");
	});

	it("ajoute un terme et une description dans la liste de définitions courante", async () => {
		document.body.innerHTML = [
			"<tp-prose-editor>",
			"<dl><dt>Term 1</dt><dd><p>Description 1</p></dd></dl>",
			"</tp-prose-editor>",
		].join("");
		await flush();

		const editor = getEditor();
		const view = (editor as unknown as { editorView: EditorView }).editorView;
		view.dispatch(
			view.state.tr.setSelection(TextSelection.create(view.state.doc, 12)),
		);

		selectMenuCommand(editor, "format-list-text");

		expect(editor.getHTML()).toBe(
			"<dl><dt>Term 1</dt><dd><p>Description 1</p></dd><dt>Term</dt><dd><p>Description</p></dd></dl>",
		);
		expect(editor.getHTML().match(/<dl>/g)).toHaveLength(1);
		expect(
			view.state.doc.textBetween(
				view.state.selection.from,
				view.state.selection.to,
			),
		).toBe("Description");
	});

	it("insère image, video et audio depuis le menu media", async () => {
		document.body.innerHTML = "<tp-prose-editor></tp-prose-editor>";
		await flush();

		const editor = getEditor();
		const imageInput = editor.querySelector<HTMLInputElement>(
			"[data-tp-prose-editor-image-file]",
		);
		const videoInput = editor.querySelector<HTMLInputElement>(
			"[data-tp-prose-editor-video-file]",
		);
		const audioInput = editor.querySelector<HTMLInputElement>(
			"[data-tp-prose-editor-audio-file]",
		);

		if (imageInput === null || videoInput === null || audioInput === null) {
			throw new Error("Media input not found");
		}

		selectMenuCommand(editor, "insert-image");
		Object.defineProperty(imageInput, "files", {
			configurable: true,
			value: [new File(["image"], "image.png", { type: "image/png" })],
		});
		imageInput.dispatchEvent(new Event("change"));
		await submitMediaAttributeDialog(editor, {
			alt: "Image alt",
			height: "240",
			width: "320",
		});
		await waitFor(() => editor.getHTML().includes("data:image/png"));

		expect(editor.getHTML()).toBe(
			'<figure><img src="data:image/png;base64,aW1hZ2U=" alt="Image alt" title="image.png" width="320" height="240"><figcaption>Image alt</figcaption></figure>',
		);

		editor.setHTML("");
		selectMenuCommand(editor, "insert-video");
		Object.defineProperty(videoInput, "files", {
			configurable: true,
			value: [new File(["video"], "video.mp4", { type: "video/mp4" })],
		});
		videoInput.dispatchEvent(new Event("change"));
		await submitMediaAttributeDialog(editor, {
			autoplay: true,
			caption: "Video caption",
			height: "360",
			poster: "/media/poster.jpg",
			title: "Video title",
			width: "640",
		});
		await waitFor(() => editor.getHTML().includes("data:video/mp4"));

		expect(editor.getHTML()).toBe(
			'<figure><video src="data:video/mp4;base64,dmlkZW8=" autoplay="" controls="" poster="/media/poster.jpg" title="Video title" width="640" height="360"></video><figcaption>Video caption</figcaption></figure>',
		);

		editor.setHTML("");
		selectMenuCommand(editor, "insert-audio");
		Object.defineProperty(audioInput, "files", {
			configurable: true,
			value: [new File(["audio"], "audio.mp3", { type: "audio/mpeg" })],
		});
		audioInput.dispatchEvent(new Event("change"));
		await submitMediaAttributeDialog(editor, {
			caption: "Audio caption",
			title: "Audio title",
		});
		await waitFor(() => editor.getHTML().includes("data:audio/mpeg"));

		expect(editor.getHTML()).toBe(
			'<figure><audio src="data:audio/mpeg;base64,YXVkaW8=" controls="" title="Audio title"></audio><figcaption>Audio caption</figcaption></figure>',
		);
	});

	it("affiche un bouton play pour un audio sans contrôles sans remplacer le média précédent", async () => {
		document.body.innerHTML = "<tp-prose-editor></tp-prose-editor>";
		await flush();

		const editor = getEditor();
		const imageInput = editor.querySelector<HTMLInputElement>(
			"[data-tp-prose-editor-image-file]",
		);
		const audioInput = editor.querySelector<HTMLInputElement>(
			"[data-tp-prose-editor-audio-file]",
		);

		if (imageInput === null || audioInput === null) {
			throw new Error("Media input not found");
		}

		selectMenuCommand(editor, "insert-image");
		Object.defineProperty(imageInput, "files", {
			configurable: true,
			value: [new File(["image"], "image.png", { type: "image/png" })],
		});
		imageInput.dispatchEvent(new Event("change"));
		await submitMediaAttributeDialog(editor, { alt: "Image alt" });
		await waitFor(() => editor.getHTML().includes("data:image/png"));

		selectMenuCommand(editor, "insert-audio");
		Object.defineProperty(audioInput, "files", {
			configurable: true,
			value: [new File(["audio"], "audio.mp3", { type: "audio/mpeg" })],
		});
		audioInput.dispatchEvent(new Event("change"));
		await submitMediaAttributeDialog(editor, {
			controls: false,
			title: "Audio title",
		});
		await waitFor(() => editor.getHTML().includes("data:audio/mpeg"));

		expect(editor.getHTML()).toContain("data:image/png");
		expect(editor.getHTML()).toContain(
			'<audio src="data:audio/mpeg;base64,YXVkaW8=" title="Audio title"></audio>',
		);
		expect(
			editor.querySelector(
				'[data-tp-prose-editor-audio-button] tp-icon-button[name="volume-high"]',
			),
		).not.toBeNull();
	});

	it("conserve un point de curseur après une liste suivie d’un composant tp-*", async () => {
		document.body.innerHTML = [
			"<tp-prose-editor>",
			"<p>un petit paragraphe</p>",
			"<ul><li>item 1</li><li>item 2</li></ul>",
			"<tp-markdown>",
			"---",
			"extensions:",
			"- math",
			"---",
			":latexmath:`\\sin(\\sqrt{1 + x^2})`",
			":tp-icon:{name=home}",
			"</tp-markdown>",
			"</tp-prose-editor>",
		].join("");
		await flush();

		const editor = getEditor();
		const view = (editor as unknown as { editorView: EditorView }).editorView;
		const endPosition = view.state.doc.content.size - 1;

		view.dispatch(
			view.state.tr.setSelection(
				TextSelection.create(view.state.doc, endPosition),
			),
		);

		expect(view.state.selection.$from.parent.type.name).toBe("paragraph");
		expect(view.state.doc.lastChild?.type.name).toBe("paragraph");
		expect(editor.getHTML()).toContain("<tp-markdown>");
		expect(editor.getHTML()).not.toMatch(/<p><\/p>$/);
	});

	it("expose getHTML(), setHTML() et value", async () => {
		document.body.innerHTML = "<tp-prose-editor></tp-prose-editor>";
		await flush();

		const editor = getEditor();
		editor.setHTML("<h2>Title</h2><p>Text</p>");

		expect(editor.getHTML()).toBe("<h2>Title</h2><p>Text</p>");
		expect(editor.value).toBe("<h2>Title</h2><p>Text</p>");
		expect(editor.getAttribute("value")).toBe("<h2>Title</h2><p>Text</p>");
	});

	it("met à jour le document quand l’attribut value change", async () => {
		document.body.innerHTML = "<tp-prose-editor></tp-prose-editor>";
		await flush();

		const editor = getEditor();
		editor.setAttribute("value", "<blockquote><p>Quote</p></blockquote>");

		expect(editor.getHTML()).toBe("<blockquote><p>Quote</p></blockquote>");
	});

	it("charge un document HTML depuis src à l’initialisation", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn(async () => new Response("<h1>Loaded</h1><p>HTML</p>")),
		);

		document.body.innerHTML =
			'<tp-prose-editor src="/doc/example.html"></tp-prose-editor>';
		await waitFor(() => getEditor().getHTML().includes("<h1>Loaded</h1>"));

		expect(fetch).toHaveBeenCalledWith(
			"http://localhost:3000/doc/example.html",
			{ cache: "no-store" },
		);
		expect(getEditor().getHTML()).toBe("<h1>Loaded</h1><p>HTML</p>");
	});

	it("charge et convertit un document Markdown depuis src à l’initialisation", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn(async () => new Response("# Loaded Markdown")),
		);

		document.body.innerHTML =
			'<tp-prose-editor src="/doc/example.md"></tp-prose-editor>';
		await waitFor(() => getEditor().getHTML().includes("Loaded Markdown"));

		expect(getEditor().getHTML()).toContain(
			'<h1 id="loaded-markdown" tabindex="-1">Loaded Markdown</h1>',
		);
	});

	it("préserve les extensions Markdown depuis src dans le rendu ProseMirror", async () => {
		vi.stubGlobal("MathJax", {
			startup: {
				promise: Promise.resolve(),
			},
			tex2svgPromise: vi.fn(async () => {
				const element = document.createElement("mjx-container");
				element.dataset.testMathjax = "latex";
				return element;
			}),
		});
		vi.stubGlobal(
			"fetch",
			vi.fn(
				async () =>
					new Response(
						[
							"---",
							"extensions:",
							"- math",
							"- yakazu",
							"---",
							"",
							"# Extensions",
							"",
							":latexmath:`E = mc^2`",
							"",
							"``` yakazu",
							"- 25431#9#4!",
							"- 1#1524673",
							"- #13!2#12#2",
							"- 2#563274!1",
							"- 12674385!#",
							"- 34!21!5#1!2#",
							"- #1#412563",
							"- 2!31#2!#312",
							"- 1#21#2431",
							"```",
						].join("\n"),
					),
			),
		);

		document.body.innerHTML =
			'<tp-prose-editor src="/doc/extensions.md"></tp-prose-editor>';
		await waitFor(() =>
			getEditor().getHTML().includes('data-test-mathjax="latex"'),
		);

		const editor = getEditor();

		expect(
			editor.querySelector(
				'[data-tp-prose-editor-markdown-preview] mjx-container[data-test-mathjax="latex"]',
			),
		).not.toBeNull();
		expect(
			editor.querySelector(
				"[data-tp-prose-editor-markdown-preview] .tp-yakazu",
			),
		).not.toBeNull();
		await waitFor(
			() =>
				editor.querySelector<HTMLInputElement>(
					"[data-tp-prose-editor-markdown-preview] .tp-yakazu-cell.initial input",
				)?.value === "4",
		);
		expect(
			editor.querySelector<HTMLInputElement>(
				"[data-tp-prose-editor-markdown-preview] .tp-yakazu-cell.initial input",
			)?.value,
		).toBe("4");
		expect(editor.getHTML()).toContain('data-test-mathjax="latex"');
		expect(editor.getHTML()).toContain("tp-yakazu");
		expect(editor.getHTML()).toContain('value="4"');
	});

	it("charge une extension inconnue depuis src dans pre-code", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn(async () => new Response("<raw>& text")),
		);

		document.body.innerHTML =
			'<tp-prose-editor src="/doc/example.txt"></tp-prose-editor>';
		await waitFor(() => getEditor().getHTML().includes("&lt;raw&gt;"));

		expect(getEditor().getHTML()).toBe(
			"<pre><code>&lt;raw&gt;&amp; text</code></pre>",
		);
	});

	it.each([
		["markdown.md", "/docs/components/prose-editor/markdown.md"],
		["./markdown.md", "/docs/components/prose-editor/markdown.md"],
		[
			"../prose-editor/markdown.md",
			"/docs/components/prose-editor/markdown.md",
		],
		[
			"../../components/prose-editor/markdown.md",
			"/docs/components/prose-editor/markdown.md",
		],
		[
			"/docs/components/prose-editor/markdown.md",
			"/docs/components/prose-editor/markdown.md",
		],
	])(
		'résout src="%s" depuis le document Markdown courant',
		async (src, expectedPath) => {
			const fetch = vi.fn(async () => new Response("# Loaded"));
			vi.stubGlobal("fetch", fetch);

			document.body.innerHTML = `
      <div data-tp-markdown-source="/docs/components/prose-editor/index.md">
        <tp-prose-editor src="${src}"></tp-prose-editor>
      </div>
    `;
			await waitFor(() => getEditor().getHTML().includes("Loaded"));

			const firstCall = fetch.mock.calls[0] as [RequestInfo | URL] | undefined;
			const requestedPath = new URL(
				String(firstCall?.[0]),
				window.location.href,
			).pathname;
			expect(requestedPath).toBe(expectedPath);
		},
	);

	it("désactive l’édition quand readonly est présent", async () => {
		document.body.innerHTML =
			"<tp-prose-editor readonly><p>Read only</p></tp-prose-editor>";
		await flush();

		const proseMirror = getEditor().querySelector(".ProseMirror");

		expect(proseMirror?.getAttribute("contenteditable")).toBe("false");
	});

	it("peut insérer une table", async () => {
		document.body.innerHTML = "<tp-prose-editor></tp-prose-editor>";
		await flush();

		const editor = getEditor();

		expect(editor.insertTable(2, 2)).toBe(true);
		expect(editor.getHTML()).toContain("<table>");
		expect(editor.getHTML()).toContain("<tbody>");
		expect(editor.getHTML().match(/<td/g)).toHaveLength(4);
	});

	it("branche le bouton table sur insertTable()", async () => {
		document.body.innerHTML = "<tp-prose-editor></tp-prose-editor>";
		await flush();

		const editor = getEditor();
		const tableButton = editor.querySelector<HTMLElement>(
			'tp-icon-button[name="table"]',
		);
		const tableDropdown = editor.querySelector<HTMLElement>(
			"[data-tp-prose-editor-table-dropdown]",
		);

		expect(tableDropdown?.hasAttribute("open")).toBe(false);

		tableButton?.click();

		expect(tableDropdown?.hasAttribute("open")).toBe(true);

		editor.querySelector<HTMLElement>("li[data-table-picker]")?.click();

		const cell = editor.querySelector<HTMLElement>(
			'[data-table-grid-cell][data-table-rows="2"][data-table-columns="4"]',
		);
		expect(cell).not.toBeNull();
		cell?.dispatchEvent(new PointerEvent("pointerover", { bubbles: true }));
		cell?.click();

		expect(editor.getHTML()).toContain("<table>");
		expect(editor.getHTML().match(/<td/g)).toHaveLength(8);
	});

	it("ajoute une légende à la table depuis le menu table", async () => {
		const prompt = vi.spyOn(window, "prompt").mockReturnValue("Table caption");
		document.body.innerHTML = "<tp-prose-editor></tp-prose-editor>";
		await flush();

		const editor = getEditor();
		expect(editor.insertTable(2, 2)).toBe(true);

		selectTableAction(editor, "add-caption");

		expect(prompt).toHaveBeenCalledWith("Table caption", "");
		expect(editor.getHTML()).toContain("<caption>Table caption</caption>");
		expect(
			editor.querySelector(".ProseMirror table caption")?.textContent,
		).toBe("Table caption");
	});

	it("ouvre le menu types et applique un bloc de code", async () => {
		document.body.innerHTML =
			"<tp-prose-editor><p>const value = 1;</p></tp-prose-editor>";
		await flush();

		const editor = getEditor();
		const typesButton = editor.querySelector<HTMLElement>(
			'tp-icon-button[data-command="types"]',
		);
		const typesDropdown = editor.querySelector<HTMLElement>(
			"[data-tp-prose-editor-type-dropdown]",
		);

		expect(typesDropdown?.hasAttribute("open")).toBe(false);

		typesButton?.click();

		expect(typesDropdown?.hasAttribute("open")).toBe(true);

		editor
			.querySelector<HTMLElement>('li[data-menu-command="format-code-block"]')
			?.click();

		expect(editor.getHTML()).toBe("<pre><code>const value = 1;</code></pre>");
		expect(
			editor.querySelector(".ProseMirror > p:last-child")?.textContent,
		).toBe("");
		expect(
			editor.querySelector(".ProseMirror")?.lastElementChild?.matches("p"),
		).toBe(true);
	});

	it("édite les blocs de code avec tp-code-editor", async () => {
		document.body.innerHTML =
			"<tp-prose-editor><pre><code>const value = 1;</code></pre></tp-prose-editor>";
		await flush();

		const editor = getEditor();
		const codeEditor = editor.querySelector<TpCodeEditorTestElement>(
			"tp-code-editor[data-tp-prose-editor-code-block]",
		);

		if (codeEditor === null) {
			throw new Error("Code editor node view not found");
		}

		expect(codeEditor.getValue()).toBe("const value = 1;");

		const toolbarButton = editor.querySelector<HTMLElement>(
			"[data-tp-prose-editor-code-toolbar]",
		);
		expect(toolbarButton?.getAttribute("name")).toBe("keyboard-f1");
		toolbarButton?.click();
		expect(codeEditor.hasAttribute("toolbar")).toBe(true);

		codeEditor.setValue("const value = 2;");
		codeEditor.dispatchEvent(
			new CustomEvent("tp-code-editor-input", {
				bubbles: true,
				detail: { value: "const value = 2;" },
			}),
		);

		expect(editor.getHTML()).toBe("<pre><code>const value = 2;</code></pre>");
	});

	it("change le langage d’un bloc de code depuis son menu", async () => {
		document.body.innerHTML =
			"<tp-prose-editor><pre><code>const value = 1;</code></pre></tp-prose-editor>";
		await flush();

		const editor = getEditor();
		const languageItem = editor.querySelector<HTMLElement>(
			'[data-code-language="javascript"]',
		);

		if (languageItem === null) {
			throw new Error("Code language item not found");
		}

		languageItem.dispatchEvent(
			new CustomEvent("tp-menu-item-select", {
				bubbles: true,
				detail: { item: languageItem },
			}),
		);

		const codeEditor = editor.querySelector<HTMLElement>(
			"tp-code-editor[data-tp-prose-editor-code-block]",
		);
		expect(codeEditor?.getAttribute("language")).toBe("javascript");
		expect(editor.getHTML()).toBe(
			'<pre><code class="language-javascript" data-language="javascript">const value = 1;</code></pre>',
		);
	});

	it("préserve le thème et la couleur des blocs de code", async () => {
		document.body.innerHTML =
			'<tp-prose-editor><pre class="tp-dark tp-teal"><code class="language-typescript" data-language="typescript">const value: number = 1;</code></pre></tp-prose-editor>';
		await flush();

		const editor = getEditor();
		const codeEditor = editor.querySelector<HTMLElement>(
			"tp-code-editor[data-tp-prose-editor-code-block]",
		);

		expect(codeEditor?.classList.contains("tp-dark")).toBe(true);
		expect(codeEditor?.classList.contains("tp-teal")).toBe(true);
		expect(editor.getHTML()).toBe(
			'<pre class="tp-dark tp-teal"><code class="language-typescript tp-dark tp-teal" data-language="typescript">const value: number = 1;</code></pre>',
		);

		codeEditor?.classList.remove("tp-dark", "tp-teal");
		codeEditor?.classList.add("tp-light", "tp-rose");
		await flush();

		expect(editor.getHTML()).toBe(
			'<pre class="tp-light tp-rose"><code class="language-typescript tp-light tp-rose" data-language="typescript">const value: number = 1;</code></pre>',
		);
	});

	it("ouvre les dropdowns file et language d’un bloc de code", async () => {
		document.body.innerHTML =
			"<tp-prose-editor><pre><code>const value = 1;</code></pre></tp-prose-editor>";
		await flush();

		const editor = getEditor();
		const fileButton = editor.querySelector<HTMLElement>(
			'[data-tp-prose-editor-code-block-toolbar] tp-icon-button[name="file"]',
		);
		const languageButton = editor.querySelector<HTMLElement>(
			'[data-tp-prose-editor-code-block-toolbar] tp-icon-button[name="code"]',
		);
		const fileDropdown = editor.querySelector<HTMLElement>(
			"[data-tp-prose-editor-code-file-dropdown]",
		);
		const languageDropdown = editor.querySelector<HTMLElement>(
			"[data-tp-prose-editor-code-language-dropdown]",
		);

		fileButton?.click();
		expect(fileDropdown?.hasAttribute("open")).toBe(true);
		expect(fileButton?.getAttribute("aria-expanded")).toBe("true");

		languageButton?.click();
		expect(languageDropdown?.hasAttribute("open")).toBe(true);
		expect(fileDropdown?.hasAttribute("open")).toBe(false);
		expect(languageButton?.getAttribute("aria-expanded")).toBe("true");
		expect(
			Array.from(
				languageDropdown?.querySelectorAll<HTMLElement>(
					"[data-code-language]",
				) ?? [],
				(item) => item.dataset.codeLanguage,
			),
		).toEqual([
			"abc",
			"css",
			"html",
			"javascript",
			"json",
			"markdown",
			"prolog",
			"python",
			"sql",
			"text",
			"typescript",
			"yaml",
		]);
	});

	it("charge un fichier local dans un bloc de code depuis son menu file", async () => {
		document.body.innerHTML =
			"<tp-prose-editor><pre><code></code></pre></tp-prose-editor>";
		await flush();

		const editor = getEditor();
		const input = editor.querySelector<HTMLInputElement>(
			"[data-tp-prose-editor-code-file]",
		);
		const loadItem = editor.querySelector<HTMLElement>(
			'[data-code-file-action="load"]',
		);

		if (input === null || loadItem === null) {
			throw new Error("Code load item not found");
		}

		loadItem.dispatchEvent(
			new CustomEvent("tp-menu-item-select", {
				bubbles: true,
				detail: { item: loadItem },
			}),
		);
		Object.defineProperty(input, "files", {
			configurable: true,
			value: [
				new File(["const value: number = 1;"], "demo.ts", {
					type: "text/plain",
				}),
			],
		});
		input.dispatchEvent(new Event("change"));
		await waitFor(() => editor.getHTML().includes('data-src="demo.ts"'));

		const codeEditor = editor.querySelector<
			TpCodeEditorTestElement & HTMLElement
		>("tp-code-editor[data-tp-prose-editor-code-block]");
		expect(codeEditor?.hasAttribute("src")).toBe(false);
		expect(codeEditor?.getAttribute("filename")).toBe("demo.ts");
		expect(codeEditor?.getAttribute("language")).toBe("typescript");
		expect(codeEditor?.getValue()).toBe("const value: number = 1;");
		expect(editor.getHTML()).toBe(
			'<pre data-src="demo.ts"><code class="language-typescript" data-language="typescript">const value: number = 1;</code></pre>',
		);
	}, 15_000);

	it("sauvegarde un bloc de code avec le finder quand Save as est disponible", async () => {
		const write = vi.fn(async (_data: Blob | string) => {});
		const close = vi.fn(async () => {});
		const showSaveFilePicker = vi.fn(async () => ({
			createWritable: async () => ({ close, write }),
		}));
		vi.stubGlobal("showSaveFilePicker", showSaveFilePicker);
		document.body.innerHTML =
			'<tp-prose-editor><pre data-src="demo.ts"><code class="language-typescript" data-language="typescript">const value: number = 1;</code></pre></tp-prose-editor>';
		await flush();

		const editor = getEditor();
		const saveAsItem = editor.querySelector<HTMLElement>(
			'[data-code-file-action="save-as"]',
		);

		if (saveAsItem === null) {
			throw new Error("Code save as item not found");
		}

		saveAsItem.dispatchEvent(
			new CustomEvent("tp-menu-item-select", {
				bubbles: true,
				detail: { item: saveAsItem },
			}),
		);
		await waitFor(() => write.mock.calls.length > 0);

		expect(showSaveFilePicker).toHaveBeenCalledWith({
			suggestedName: "demo.ts",
			types: [
				{
					description: "Text file",
					accept: {
						"text/plain": [".ts"],
					},
				},
			],
		});
		expect(write.mock.calls[0]?.[0]).toBeInstanceOf(Blob);
		expect(close).toHaveBeenCalled();
	});

	it("demande un nom de fichier pour Save as quand le finder de sauvegarde est indisponible", async () => {
		vi.stubGlobal("showSaveFilePicker", undefined);
		const prompt = vi.spyOn(window, "prompt").mockReturnValue("renamed.ts");
		const createURLSpy = vi
			.spyOn(URL, "createObjectURL")
			.mockReturnValue("blob:test");
		const revokeURLSpy = vi
			.spyOn(URL, "revokeObjectURL")
			.mockImplementation(() => undefined);
		document.body.innerHTML =
			'<tp-prose-editor><pre data-src="demo.ts"><code class="language-typescript" data-language="typescript">const value: number = 1;</code></pre></tp-prose-editor>';
		await flush();

		const editor = getEditor();
		const saveAsItem = editor.querySelector<HTMLElement>(
			'[data-code-file-action="save-as"]',
		);

		if (saveAsItem === null) {
			throw new Error("Code save as item not found");
		}

		saveAsItem.dispatchEvent(
			new CustomEvent("tp-menu-item-select", {
				bubbles: true,
				detail: { item: saveAsItem },
			}),
		);
		await waitFor(() => createURLSpy.mock.calls.length > 0);

		expect(prompt).toHaveBeenCalledWith("File name", "demo.ts");
		expect(createURLSpy.mock.calls[0]?.[0]).toBeInstanceOf(Blob);
		expect(revokeURLSpy).toHaveBeenCalledWith("blob:test");
	});

	it("insère un bloc Markdown éditable rendu en HTML", async () => {
		document.body.innerHTML = "<tp-prose-editor><p>Intro</p></tp-prose-editor>";
		await flush();

		const editor = getEditor();
		const typesButton = editor.querySelector<HTMLElement>(
			'tp-icon-button[data-command="types"]',
		);
		typesButton?.click();
		editor
			.querySelector<HTMLElement>(
				'li[data-menu-command="insert-markup-markdown"]',
			)
			?.click();
		await flush();

		const markdownEditor = editor.querySelector<TpCodeEditorTestElement>(
			"tp-code-editor[data-tp-prose-editor-markdown-source]",
		);

		if (markdownEditor === null) {
			throw new Error("Markdown editor node view not found");
		}

		expect(markdownEditor.querySelector(".cm-content")).toBe(
			document.activeElement,
		);
		expect(window.getSelection()?.isCollapsed ?? true).toBe(true);

		markdownEditor.setValue("# Hello");
		markdownEditor.dispatchEvent(
			new CustomEvent("tp-code-editor-input", {
				bubbles: true,
				detail: { value: "# Hello" },
			}),
		);
		await waitFor(() =>
			editor.getHTML().includes('<h1 id="hello" tabindex="-1">Hello</h1>'),
		);

		const html = editor.getHTML();
		expect(
			editor.querySelector("[data-tp-prose-editor-markdown-preview] h1")
				?.textContent,
		).toBe("Hello");
		expect(html).toContain('<h1 id="hello" tabindex="-1">Hello</h1>');
		expect(html).toContain("<p>Intro</p>");
		expect(html).not.toContain("data-tp-prose-editor-markdown-block");
	});

	it("bascule l’affichage du bloc Markdown entre source et rendu", async () => {
		document.body.innerHTML = "<tp-prose-editor><p>Intro</p></tp-prose-editor>";
		await flush();

		const editor = getEditor();
		editor
			.querySelector<HTMLElement>('tp-icon-button[data-command="types"]')
			?.click();
		editor
			.querySelector<HTMLElement>(
				'li[data-menu-command="insert-markup-markdown"]',
			)
			?.click();
		await flush();

		const markdownEditor = editor.querySelector<HTMLElement>(
			"tp-code-editor[data-tp-prose-editor-markdown-source]",
		);
		const preview = editor.querySelector<HTMLElement>(
			"[data-tp-prose-editor-markdown-preview]",
		);
		const bothButton = editor.querySelector<HTMLElement>(
			'tp-icon-button[data-markdown-view="both"]',
		);
		const sourceButton = editor.querySelector<HTMLElement>(
			'tp-icon-button[data-markdown-view="source"]',
		);
		const previewButton = editor.querySelector<HTMLElement>(
			'tp-icon-button[data-markdown-view="preview"]',
		);

		expect(markdownEditor?.hidden).toBe(false);
		expect(preview?.hidden).toBe(false);
		expect(bothButton?.getAttribute("aria-pressed")).toBe("true");
		expect(bothButton?.getAttribute("name")).toBe("splitscreen");
		expect(sourceButton?.getAttribute("name")).toBe("splitscreen-top");
		expect(previewButton?.getAttribute("name")).toBe("splitscreen-bottom");

		previewButton?.click();

		expect(markdownEditor?.hidden).toBe(true);
		expect(preview?.hidden).toBe(false);
		expect(previewButton?.getAttribute("aria-pressed")).toBe("true");

		sourceButton?.click();

		expect(markdownEditor?.hidden).toBe(false);
		expect(preview?.hidden).toBe(true);
		expect(sourceButton?.getAttribute("aria-pressed")).toBe("true");

		if (markdownEditor === null || previewButton === null) {
			throw new Error("Markdown view controls not found");
		}

		const selection = window.getSelection();
		const range = document.createRange();
		range.selectNodeContents(markdownEditor);
		selection?.removeAllRanges();
		selection?.addRange(range);
		expect(selection?.rangeCount).toBe(1);

		previewButton.click();

		expect(markdownEditor.hidden).toBe(true);
		expect(preview?.hidden).toBe(false);
		expect(previewButton.getAttribute("aria-pressed")).toBe("true");
		expect(window.getSelection()?.rangeCount).toBe(0);

		sourceButton?.click();
		expect(markdownEditor.hidden).toBe(false);
		expect(preview?.hidden).toBe(true);

		bothButton?.click();

		expect(markdownEditor?.hidden).toBe(false);
		expect(preview?.hidden).toBe(false);
		expect(bothButton?.getAttribute("aria-pressed")).toBe("true");
	});

	it("bascule le menu HTML entre le rendu et le code source", async () => {
		document.body.innerHTML = "<tp-prose-editor><p>Hello</p></tp-prose-editor>";
		await flush();

		const editor = getEditor();
		const htmlButton = editor.querySelector<HTMLElement>(
			'tp-icon-button[name="language-html"]',
		);
		const htmlDropdown = editor.querySelector<HTMLElement>(
			"[data-tp-prose-editor-html-dropdown]",
		);
		const surface = editor.querySelector<HTMLElement>(
			"[data-tp-prose-editor-surface]",
		);
		const htmlSource = editor.querySelector<HTMLTextAreaElement>(
			"[data-tp-prose-editor-html-source]",
		);
		const htmlRendered = editor.querySelector<HTMLElement>(
			"[data-tp-prose-editor-html-rendered]",
		);

		htmlButton?.click();
		expect(htmlDropdown?.hasAttribute("open")).toBe(true);
		editor.querySelector<HTMLElement>('li[data-html-action="code"]')?.click();

		expect(surface?.hidden).toBe(true);
		expect(htmlSource?.hidden).toBe(false);
		expect(htmlSource?.value).toBe("<p>Hello</p>");
		expect(htmlSource?.selectionStart).toBe(htmlSource?.selectionEnd);

		if (htmlSource === null) {
			throw new Error("HTML source not found");
		}

		htmlSource.value = "<h1>Updated</h1>";
		htmlSource.dispatchEvent(new Event("input"));

		expect(editor.getHTML()).toBe("<h1>Updated</h1>");

		htmlButton?.click();
		editor.querySelector<HTMLElement>('li[data-html-action="render"]')?.click();

		expect(window.getSelection()?.toString()).toBe("");
		expect(surface?.hidden).toBe(true);
		expect(htmlSource.hidden).toBe(true);
		expect(htmlRendered?.hidden).toBe(false);
		expect(htmlRendered?.querySelector("h1")?.textContent).toBe("Updated");
		expect(editor.getHTML()).toBe("<h1>Updated</h1>");

		if (htmlRendered === null) {
			throw new Error("HTML rendered surface not found");
		}

		const selection = window.getSelection();
		const range = document.createRange();
		range.selectNodeContents(htmlRendered);
		selection?.removeAllRanges();
		selection?.addRange(range);
		expect(selection?.rangeCount).toBe(1);

		htmlButton?.click();
		editor.querySelector<HTMLElement>('li[data-html-action="editor"]')?.click();

		expect(surface?.hidden).toBe(false);
		expect(htmlRendered?.hidden).toBe(true);
		expect(window.getSelection()?.rangeCount).toBe(0);
	});

	it("présente le code HTML avec retours à la ligne et indentation", async () => {
		document.body.innerHTML =
			"<tp-prose-editor><blockquote><p>Quote</p></blockquote><p>World</p></tp-prose-editor>";
		await flush();

		const editor = getEditor();
		const htmlSource = editor.querySelector<HTMLTextAreaElement>(
			"[data-tp-prose-editor-html-source]",
		);

		editor
			.querySelector<HTMLElement>('tp-icon-button[name="language-html"]')
			?.click();
		editor.querySelector<HTMLElement>('li[data-html-action="code"]')?.click();

		expect(htmlSource?.value).toBe(
			["<blockquote>", "  <p>Quote</p>", "</blockquote>", "<p>World</p>"].join(
				"\n",
			),
		);
	});

	it("affiche le rendu HTML sans remplacer les blocs Markdown ProseMirror", async () => {
		document.body.innerHTML = "<tp-prose-editor><p>Intro</p></tp-prose-editor>";
		await flush();

		const editor = getEditor();
		const surface = editor.querySelector<HTMLElement>(
			"[data-tp-prose-editor-surface]",
		);
		const htmlRendered = editor.querySelector<HTMLElement>(
			"[data-tp-prose-editor-html-rendered]",
		);
		editor
			.querySelector<HTMLElement>('tp-icon-button[data-command="types"]')
			?.click();
		editor
			.querySelector<HTMLElement>(
				'li[data-menu-command="insert-markup-markdown"]',
			)
			?.click();
		await flush();

		const markdownEditor = editor.querySelector<TpCodeEditorTestElement>(
			"tp-code-editor[data-tp-prose-editor-markdown-source]",
		);

		if (markdownEditor === null) {
			throw new Error("Markdown editor node view not found");
		}

		markdownEditor.setValue("# Hello");
		markdownEditor.dispatchEvent(
			new CustomEvent("tp-code-editor-input", {
				bubbles: true,
				detail: { value: "# Hello" },
			}),
		);
		await waitFor(() =>
			editor.getHTML().includes('<h1 id="hello" tabindex="-1">Hello</h1>'),
		);

		editor
			.querySelector<HTMLElement>('tp-icon-button[name="language-html"]')
			?.click();
		editor.querySelector<HTMLElement>('li[data-html-action="render"]')?.click();
		await flush();

		expect(surface?.hidden).toBe(true);
		expect(htmlRendered?.hidden).toBe(false);
		expect(htmlRendered?.querySelector("h1")?.textContent).toBe("Hello");
		expect(
			editor.querySelector(
				"tp-code-editor[data-tp-prose-editor-markdown-source]",
			),
		).toBeTruthy();
		expect(
			editor.querySelector("[data-tp-prose-editor-markdown-preview]"),
		).toBeTruthy();
		expect(editor.getHTML()).toContain(">Hello</h1>");

		editor
			.querySelector<HTMLElement>('tp-icon-button[name="language-html"]')
			?.click();
		editor.querySelector<HTMLElement>('li[data-html-action="editor"]')?.click();
		await flush();

		expect(surface?.hidden).toBe(false);
		expect(htmlRendered?.hidden).toBe(true);
		expect(
			editor.querySelector(
				"tp-code-editor[data-tp-prose-editor-markdown-source]",
			),
		).toBeTruthy();
	});

	it("préserve les code editors dans le rendu HTML", async () => {
		document.body.innerHTML =
			'<tp-prose-editor><pre data-src="demo.ts" class="tp-dark tp-teal"><code class="language-typescript" data-language="typescript">const value: number = 1;</code></pre></tp-prose-editor>';
		await flush();

		const editor = getEditor();
		const htmlRendered = editor.querySelector<HTMLElement>(
			"[data-tp-prose-editor-html-rendered]",
		);

		editor
			.querySelector<HTMLElement>('tp-icon-button[name="language-html"]')
			?.click();
		editor.querySelector<HTMLElement>('li[data-html-action="render"]')?.click();
		await waitFor(
			() =>
				htmlRendered?.querySelector("tp-code-editor.tp-dark.tp-teal") !== null,
		);

		const renderedCodeEditor = htmlRendered?.querySelector<
			TpCodeEditorTestElement & HTMLElement
		>("tp-code-editor");
		const script = renderedCodeEditor?.querySelector(
			'script[type="tp/typescript"]',
		);

		expect(renderedCodeEditor?.getAttribute("language")).toBe("typescript");
		expect(renderedCodeEditor?.getAttribute("filename")).toBe("demo.ts");
		expect(renderedCodeEditor?.classList.contains("tp-dark")).toBe(true);
		expect(renderedCodeEditor?.classList.contains("tp-teal")).toBe(true);
		expect(renderedCodeEditor?.hasAttribute("line-numbers")).toBe(true);
		expect(renderedCodeEditor?.hasAttribute("word-wrap")).toBe(true);
		expect(script?.getAttribute("filename")).toBe("demo.ts");
		expect(script?.textContent).toBe("const value: number = 1;");
		expect(
			renderedCodeEditor?.querySelector("[data-tp-code-editor-theme]"),
		).not.toBeNull();
	});

	it("affiche les formules Markdown dans le rendu HTML", async () => {
		vi.stubGlobal("MathJax", {
			startup: {
				promise: Promise.resolve(),
			},
			tex2svgPromise: vi.fn(async () => {
				const element = document.createElement("mjx-container");
				element.dataset.testMathjax = "latex";
				return element;
			}),
		});

		document.body.innerHTML = "<tp-prose-editor><p>Intro</p></tp-prose-editor>";
		await flush();

		const editor = getEditor();
		const htmlRendered = editor.querySelector<HTMLElement>(
			"[data-tp-prose-editor-html-rendered]",
		);

		editor
			.querySelector<HTMLElement>('tp-icon-button[data-command="types"]')
			?.click();
		editor
			.querySelector<HTMLElement>(
				'li[data-menu-command="insert-markup-markdown"]',
			)
			?.click();
		await flush();

		const markdownEditor = editor.querySelector<TpCodeEditorTestElement>(
			"tp-code-editor[data-tp-prose-editor-markdown-source]",
		);

		if (markdownEditor === null) {
			throw new Error("Markdown editor node view not found");
		}

		markdownEditor.setValue(
			["---", "extensions:", "- math", "---", ":latexmath:`E = mc^2`"].join(
				"\n",
			),
		);
		markdownEditor.dispatchEvent(
			new CustomEvent("tp-code-editor-input", {
				bubbles: true,
				detail: { value: markdownEditor.getValue() },
			}),
		);
		await waitFor(() => editor.getHTML().includes('data-test-mathjax="latex"'));

		editor
			.querySelector<HTMLElement>('tp-icon-button[name="language-html"]')
			?.click();
		editor.querySelector<HTMLElement>('li[data-html-action="render"]')?.click();
		await waitFor(
			() =>
				htmlRendered?.querySelector(
					'mjx-container[data-test-mathjax="latex"]',
				) !== null,
		);

		expect(htmlRendered?.hidden).toBe(false);
		expect(
			htmlRendered?.querySelector('mjx-container[data-test-mathjax="latex"]'),
		).not.toBeNull();
	});

	it("sélectionne le rendu HTML visible avec le bouton select-all", async () => {
		document.body.innerHTML = "<tp-prose-editor><p>Intro</p></tp-prose-editor>";
		await flush();

		const editor = getEditor();
		editor
			.querySelector<HTMLElement>('tp-icon-button[data-command="types"]')
			?.click();
		editor
			.querySelector<HTMLElement>(
				'li[data-menu-command="insert-markup-markdown"]',
			)
			?.click();
		await flush();

		const markdownEditor = editor.querySelector<TpCodeEditorTestElement>(
			"tp-code-editor[data-tp-prose-editor-markdown-source]",
		);

		if (markdownEditor === null) {
			throw new Error("Markdown editor node view not found");
		}

		markdownEditor.setValue("# Hello");
		markdownEditor.dispatchEvent(
			new CustomEvent("tp-code-editor-input", {
				bubbles: true,
				detail: { value: "# Hello" },
			}),
		);
		await waitFor(() =>
			editor.getHTML().includes('<h1 id="hello" tabindex="-1">Hello</h1>'),
		);

		editor
			.querySelector<HTMLElement>('tp-icon-button[name="language-html"]')
			?.click();
		editor.querySelector<HTMLElement>('li[data-html-action="render"]')?.click();
		const selectAllButton = editor.querySelector<HTMLElement>(
			'tp-icon-button[name="select-all"]',
		);
		selectAllButton?.click();

		const selection = window.getSelection();
		expect(selection?.rangeCount).toBe(1);
		expect(selection?.getRangeAt(0).commonAncestorContainer).toBe(
			editor.querySelector("[data-tp-prose-editor-html-rendered]"),
		);
		expect(selectAllButton?.getAttribute("aria-pressed")).toBe("true");
	});

	it("sélectionne tout le contenu avec le bouton select-all", async () => {
		document.body.innerHTML =
			"<tp-prose-editor><p>Hello</p><p>World</p></tp-prose-editor>";
		await flush();

		const editor = getEditor();
		const view = (editor as unknown as { editorView: EditorView }).editorView;
		const button = editor.querySelector<HTMLElement>(
			'tp-icon-button[name="select-all"]',
		);

		button?.click();

		expect(view.state.selection.from).toBe(0);
		expect(view.state.selection.to).toBe(view.state.doc.content.size);
		expect(button?.getAttribute("aria-pressed")).toBe("true");

		button?.click();

		expect(view.state.selection.from).toBe(1);
		expect(view.state.selection.empty).toBe(true);
		expect(button?.getAttribute("aria-pressed")).toBe("false");
	});

	it("importe un fichier Markdown via le menu files", async () => {
		document.body.innerHTML = "<tp-prose-editor></tp-prose-editor>";
		await flush();

		const editor = getEditor();
		const input = editor.querySelector<HTMLInputElement>(
			"[data-tp-prose-editor-markdown-file]",
		);
		const file = new File(["# Imported"], "imported.md", {
			type: "text/markdown",
		});

		if (input === null) {
			throw new Error("Markdown input not found");
		}

		Object.defineProperty(input, "files", {
			configurable: true,
			value: [file],
		});
		input.dispatchEvent(new Event("change"));
		await waitFor(() => editor.getHTML() !== "<p></p>");

		expect(editor.getHTML()).toBe("<h1>Imported</h1>");
	});

	it("permet undo après un import Markdown", async () => {
		document.body.innerHTML =
			"<tp-prose-editor><p>Before import</p></tp-prose-editor>";
		await flush();

		const editor = getEditor();
		const input = editor.querySelector<HTMLInputElement>(
			"[data-tp-prose-editor-markdown-file]",
		);
		const file = new File(["# Imported"], "imported.md", {
			type: "text/markdown",
		});

		if (input === null) {
			throw new Error("Markdown input not found");
		}

		Object.defineProperty(input, "files", {
			configurable: true,
			value: [file],
		});
		input.dispatchEvent(new Event("change"));
		await waitFor(() => editor.getHTML().includes("<h1>Imported</h1>"));

		editor.querySelector<HTMLElement>('tp-icon-button[name="undo"]')?.click();

		expect(editor.getHTML()).toBe("<p>Before import</p>");
	});

	it("insère un import Markdown à la position du curseur", async () => {
		document.body.innerHTML =
			"<tp-prose-editor><p>BeforeAfter</p></tp-prose-editor>";
		await flush();

		const editor = getEditor();
		const input = editor.querySelector<HTMLInputElement>(
			"[data-tp-prose-editor-markdown-file]",
		);
		const file = new File(["# Imported"], "imported.md", {
			type: "text/markdown",
		});

		if (input === null) {
			throw new Error("Markdown input not found");
		}

		setCursor(editor, 7);
		Object.defineProperty(input, "files", {
			configurable: true,
			value: [file],
		});
		input.dispatchEvent(new Event("change"));
		await waitFor(() => editor.getHTML().includes("<h1>Imported</h1>"));

		expect(editor.getHTML()).toBe("<p>Before</p><h1>Imported</h1><p>After</p>");
	});

	it("insère un import HTML à la position du curseur", async () => {
		document.body.innerHTML =
			"<tp-prose-editor><p>BeforeAfter</p></tp-prose-editor>";
		await flush();

		const editor = getEditor();
		const input = editor.querySelector<HTMLInputElement>(
			"[data-tp-prose-editor-html-file]",
		);
		const file = new File(
			["<blockquote><p>Imported</p></blockquote>"],
			"imported.html",
			{ type: "text/html" },
		);

		if (input === null) {
			throw new Error("HTML input not found");
		}

		setCursor(editor, 7);
		Object.defineProperty(input, "files", {
			configurable: true,
			value: [file],
		});
		input.dispatchEvent(new Event("change"));
		await waitFor(() => editor.getHTML().includes("<blockquote>"));

		expect(editor.getHTML()).toBe(
			"<p>Before</p><blockquote><p>Imported</p></blockquote><p>After</p>",
		);
	});

	it("préserve les custom elements tp-* pendant l’import Markdown", async () => {
		document.body.innerHTML = "<tp-prose-editor></tp-prose-editor>";
		await flush();

		const editor = getEditor();
		const input = editor.querySelector<HTMLInputElement>(
			"[data-tp-prose-editor-markdown-file]",
		);
		const file = new File(
			[
				'<tp-fill-blank-question answer="went"><dl><dt>form</dt><dd><input name="blank1"></dd></dl></tp-fill-blank-question>',
			],
			"fill-blank.md",
			{ type: "text/markdown" },
		);

		if (input === null) {
			throw new Error("Markdown input not found");
		}

		Object.defineProperty(input, "files", {
			configurable: true,
			value: [file],
		});
		input.dispatchEvent(new Event("change"));
		await waitFor(() => editor.getHTML().includes("<tp-fill-blank-question"));

		expect(editor.getHTML()).toContain("<tp-fill-blank-question");
		expect(editor.getHTML()).toContain('answer="went"');
	});

	it("demande un nom de fichier avec Save HTML as", async () => {
		vi.stubGlobal("showSaveFilePicker", undefined);
		document.body.innerHTML =
			"<tp-prose-editor><p>Save me</p></tp-prose-editor>";
		await flush();

		const editor = getEditor();
		const promptSpy = vi.spyOn(window, "prompt").mockReturnValue("custom-page");
		const createURLSpy = vi
			.spyOn(URL, "createObjectURL")
			.mockReturnValue("blob:test");
		const revokeURLSpy = vi
			.spyOn(URL, "revokeObjectURL")
			.mockImplementation(() => undefined);
		const clickSpy = vi
			.spyOn(HTMLAnchorElement.prototype, "click")
			.mockImplementation(() => undefined);
		let downloadName = "";
		const appendSpy = vi.spyOn(document.body, "append");
		appendSpy.mockImplementation((...nodes: (Node | string)[]) => {
			const anchor = nodes.find(
				(node): node is HTMLAnchorElement => node instanceof HTMLAnchorElement,
			);
			downloadName = anchor?.download ?? "";
			HTMLElement.prototype.append.apply(document.body, nodes);
		});

		editor
			.querySelector<HTMLElement>('li[data-file-action="save-html-as"]')
			?.click();

		expect(promptSpy).toHaveBeenCalledWith("File name", "prose-editor.html");
		expect(downloadName).toBe("custom-page.html");
		expect(clickSpy).toHaveBeenCalled();

		promptSpy.mockRestore();
		createURLSpy.mockRestore();
		revokeURLSpy.mockRestore();
		clickSpy.mockRestore();
		appendSpy.mockRestore();
	});

	it("sauvegarde HTML avec le finder quand Save HTML as est disponible", async () => {
		const write = vi.fn(async (_data: Blob | string) => {});
		const close = vi.fn(async () => {});
		const showSaveFilePicker = vi.fn(async () => ({
			createWritable: async () => ({ close, write }),
		}));
		vi.stubGlobal("showSaveFilePicker", showSaveFilePicker);
		document.body.innerHTML =
			"<tp-prose-editor><p>Save me</p></tp-prose-editor>";
		await flush();

		const editor = getEditor();
		editor
			.querySelector<HTMLElement>('li[data-file-action="save-html-as"]')
			?.click();
		await waitFor(() => write.mock.calls.length > 0);

		expect(showSaveFilePicker).toHaveBeenCalledWith({
			suggestedName: "prose-editor.html",
			types: [
				{
					description: "Text file",
					accept: {
						"text/html": [".html"],
					},
				},
			],
		});
		expect(write.mock.calls[0]?.[0]).toBeInstanceOf(Blob);
		expect(close).toHaveBeenCalled();
	});

	it("sauvegarde les composants tp-* avec le loader", async () => {
		document.body.innerHTML = "<tp-prose-editor></tp-prose-editor>";
		await flush();

		const editor = getEditor();
		let savedBlob: Blob | undefined;
		const createURLSpy = vi
			.spyOn(URL, "createObjectURL")
			.mockImplementation((blob) => {
				if (blob instanceof Blob) {
					savedBlob = blob;
				}
				return "blob:test";
			});
		const revokeURLSpy = vi
			.spyOn(URL, "revokeObjectURL")
			.mockImplementation(() => undefined);
		const clickSpy = vi
			.spyOn(HTMLAnchorElement.prototype, "click")
			.mockImplementation(() => undefined);

		editor.setHTML(
			'<tp-fill-blank-question answer="went"><dl><dt>form</dt><dd><input name="blank1"></dd></dl></tp-fill-blank-question>',
		);
		editor
			.querySelector<HTMLElement>('li[data-file-action="save-html"]')
			?.click();

		const blob = savedBlob;

		if (blob === undefined) {
			throw new Error("Saved HTML blob not found");
		}

		const savedHTML = await blob.text();
		expect(savedHTML).toContain("<tp-fill-blank-question");
		expect(savedHTML).toContain('answer="went"');
		expect(savedHTML).toContain(
			'<script type="module" src="./tp-loader.js"></script>',
		);

		createURLSpy.mockRestore();
		revokeURLSpy.mockRestore();
		clickSpy.mockRestore();
	});

	it("affiche le champ de recherche avec le bouton search", async () => {
		document.body.innerHTML =
			"<tp-prose-editor><p>Search me</p></tp-prose-editor>";
		await flush();

		const editor = getEditor();
		const searchButton = editor.querySelector<HTMLElement>(
			'tp-icon-button[name="search"]',
		);
		const searchControl = editor.querySelector<HTMLElement>(
			"[data-tp-prose-editor-search-control]",
		);
		const searchInput = editor.querySelector<HTMLInputElement>(
			"[data-tp-prose-editor-search-input]",
		);
		const clearButton = editor.querySelector<HTMLElement>(
			"[data-tp-prose-editor-search-clear]",
		);

		expect(searchControl?.hidden).toBe(true);
		expect(searchInput?.hidden).toBe(true);

		searchButton?.click();

		expect(searchControl?.hidden).toBe(false);
		expect(searchInput?.hidden).toBe(false);
		expect(clearButton?.hidden).toBe(false);
		expect(clearButton?.getAttribute("label")).toBe("Close search");
	});

	it("cherche le texte saisi et active le résultat courant", async () => {
		document.body.innerHTML =
			"<tp-prose-editor><p>Search me</p></tp-prose-editor>";
		await flush();

		const editor = getEditor();
		const searchButton = editor.querySelector<HTMLElement>(
			'tp-icon-button[name="search"]',
		);
		const searchInput = editor.querySelector<HTMLInputElement>(
			"[data-tp-prose-editor-search-input]",
		);

		searchButton?.click();

		if (searchInput === null) {
			throw new Error("Search input not found");
		}

		searchInput.value = "me";
		searchInput.dispatchEvent(new Event("input"));
		await flush();

		expect(
			editor.querySelector(".ProseMirror-active-search-match"),
		).toBeTruthy();
	});

	it("efface la recherche courante avec le bouton clear", async () => {
		document.body.innerHTML =
			"<tp-prose-editor><p>Search me</p></tp-prose-editor>";
		await flush();

		const editor = getEditor();
		const searchButton = editor.querySelector<HTMLElement>(
			'tp-icon-button[name="search"]',
		);
		const searchInput = editor.querySelector<HTMLInputElement>(
			"[data-tp-prose-editor-search-input]",
		);
		const clearButton = editor.querySelector<HTMLElement>(
			"[data-tp-prose-editor-search-clear]",
		);

		searchButton?.click();

		if (searchInput === null || clearButton === null) {
			throw new Error("Search controls not found");
		}

		searchInput.value = "me";
		searchInput.dispatchEvent(new Event("input"));
		await flush();

		expect(clearButton.hidden).toBe(false);
		expect(
			editor.querySelector(".ProseMirror-active-search-match"),
		).toBeTruthy();

		clearButton.click();
		await flush();

		expect(searchInput.value).toBe("");
		expect(clearButton.hidden).toBe(false);
		expect(clearButton.getAttribute("label")).toBe("Close search");
		expect(editor.querySelector(".ProseMirror-active-search-match")).toBeNull();

		clearButton.click();
		await flush();

		expect(searchInput.hidden).toBe(true);
	});

	it("covers property setters, focus variants and the complete public table API", async () => {
		const editor = document.createElement(
			"tp-prose-editor",
		) as unknown as HTMLElement & {
			value: string;
			placeholder: string;
			readonly: boolean;
			src: string;
			focus(options?: FocusOptions): void;
			insertTable(rows?: number, columns?: number): boolean;
			addTableRowAfter(): boolean;
			addTableColumnAfter(): boolean;
			deleteTableRow(): boolean;
			deleteTableColumn(): boolean;
			deleteTable(): boolean;
			findPrevious(value?: string): boolean;
			disconnectedCallback(): void;
		};
		document.body.append(editor);
		await flush();
		editor.value = "<p>alpha beta alpha</p>";
		editor.placeholder = "Write";
		editor.readonly = true;
		editor.readonly = false;
		editor.src = "";
		expect(editor.src).toBe("");
		expect(editor.placeholder).toBe("Write");
		editor.focus();
		editor.focus({ preventScroll: true });
		expect(editor.findPrevious("alpha")).toBe(true);
		expect(editor.insertTable(2, 2)).toBe(true);
		expect(editor.addTableRowAfter()).toBe(true);
		expect(editor.addTableColumnAfter()).toBe(true);
		expect(editor.deleteTableRow()).toBe(true);
		expect(editor.deleteTableColumn()).toBe(true);
		expect(editor.deleteTable()).toBe(true);
		editor.disconnectedCallback();
		expect(editor.insertTable()).toBe(false);
		expect(editor.addTableRowAfter()).toBe(false);
	});

	it("covers clipboard fallbacks, picker guards and embedded-control event filtering", async () => {
		const editor = document.createElement(
			"tp-prose-editor",
		) as unknown as HTMLElement & {
			runClipboardCommand(command: string): Promise<void>;
			handleEmojiPickerSelect(event: Event): void;
			handleSymbolPickerSelect(event: Event): void;
			handleIconPickerSelect(event: Event): void;
			shouldIgnoreCustomElementEvent(event: Event): boolean;
			insertInlineIcon(value: string): void;
			insertPickerText(value: string): void;
		};
		editor.innerHTML = "<p>clipboard</p>";
		document.body.append(editor);
		await flush();
		const execCommand = vi.fn().mockReturnValue(true);
		Object.defineProperty(document, "execCommand", {
			configurable: true,
			value: execCommand,
		});
		Object.defineProperty(navigator, "clipboard", {
			configurable: true,
			value: { readText: vi.fn().mockResolvedValue(" inserted ") },
		});
		await editor.runClipboardCommand("copy");
		await editor.runClipboardCommand("cut");
		await editor.runClipboardCommand("paste");
		expect(execCommand).toHaveBeenCalledWith("copy");
		expect(execCommand).toHaveBeenCalledWith("cut");
		expect(editor.textContent).toContain("inserted");
		Object.defineProperty(navigator, "clipboard", {
			configurable: true,
			value: { readText: vi.fn().mockRejectedValue(new Error("denied")) },
		});
		await editor.runClipboardCommand("paste");
		expect(execCommand).toHaveBeenCalledWith("paste");
		editor.handleEmojiPickerSelect(new CustomEvent("select", { detail: {} }));
		editor.handleSymbolPickerSelect(
			new CustomEvent("select", { detail: { value: 2 } }),
		);
		editor.handleIconPickerSelect(
			new CustomEvent("select", {
				detail: { value: "<span>not an icon</span>" },
			}),
		);
		editor.insertInlineIcon('<tp-icon name="star"></tp-icon>');
		editor.insertPickerText("★");
		expect(editor.shouldIgnoreCustomElementEvent(new Event("focus"))).toBe(
			true,
		);
		expect(editor.shouldIgnoreCustomElementEvent(new Event("keydown"))).toBe(
			true,
		);
		expect(editor.shouldIgnoreCustomElementEvent(new Event("custom"))).toBe(
			false,
		);
		const input = document.createElement("input");
		expect(
			editor.shouldIgnoreCustomElementEvent(
				new CustomEvent("custom", { detail: input }),
			),
		).toBe(false);
		input.addEventListener("custom", (event) =>
			expect(editor.shouldIgnoreCustomElementEvent(event)).toBe(true),
		);
		input.dispatchEvent(new Event("custom"));
	});

	it("parses every directly supported rich node representation", async () => {
		const editor = document.createElement(
			"tp-prose-editor",
		) as unknown as HTMLElement & {
			setHTML(value: string): void;
			getHTML(): string;
		};
		document.body.append(editor);
		await flush();
		editor.setHTML(`
      <video src="movie.mp4" controls width="320" height="180" title="Movie"></video>
      <audio src="sound.mp3" controls title="Sound"></audio>
      <p>Inline <tp-icon name="star"></tp-icon></p>
      <div data-tp-prose-editor-markdown-block data-language="markdown" data-markdown="# Title" data-view="source"><h1>Title</h1></div>
      <p><span data-mathjax-tex="x+1" data-mathjax-display="false"></span></p>
      <div data-mathjax-tex="x^2" data-mathjax-display="true"></div>
      <table><caption>Values</caption><tbody><tr><td><p>A</p></td></tr></tbody></table>
    `);
		await flush();
		const html = editor.getHTML();
		expect(html).toContain("movie.mp4");
		expect(html).toContain("sound.mp3");
		expect(html).toContain("tp-icon");
		expect(html).toContain("<h1>Title</h1>");
		expect(html).toContain('data-mathjax-tex="x+1"');
		expect(html).toContain("<caption>Values</caption>");
	});

	it("exposes every formatting and insertion command to command-state probing", async () => {
		const editor = document.createElement("tp-prose-editor");
		editor.innerHTML = "<p>Text</p>";
		document.body.append(editor);
		await flush();
		type State = EditorView["state"];
		type Command = (
			state: State,
			dispatch?: EditorView["dispatch"],
			view?: EditorView,
		) => boolean;
		const internal = editor as unknown as {
			editorView: EditorView;
			clearFormatting: Command;
			insertHorizontalRule: Command;
			insertInlineMath: Command;
			insertMathBlock: Command;
			insertMarkdownBlock: Command;
			insertImage: Command;
			insertVideo: Command;
			insertAudio: Command;
			toggleLink: Command;
			toggleHeading(level: number): Command;
			insertMarkupBlock(language: "markdown" | "asciidoc"): Command;
		};
		const state = internal.editorView.state;
		expect(internal.clearFormatting(state)).toBe(true);
		expect(internal.insertHorizontalRule(state)).toBe(true);
		expect(internal.toggleHeading(2)(state)).toBe(true);
		const prompt = vi.spyOn(window, "prompt").mockReturnValue("x + 1");
		expect(internal.insertInlineMath(state)).toBe(true);
		expect(internal.insertMathBlock(state)).toBe(true);
		expect(internal.insertMarkdownBlock(state)).toBe(true);
		expect(internal.insertMarkupBlock("asciidoc")(state)).toBe(true);
		expect(internal.insertImage(state)).toBe(true);
		expect(internal.insertVideo(state)).toBe(true);
		expect(internal.insertAudio(state)).toBe(true);
		prompt.mockReturnValue(null);
		expect(internal.toggleLink(state)).toBe(false);
	});

	it("exercises the lifecycle hooks of rich embedded node views", async () => {
		const editor = document.createElement(
			"tp-prose-editor",
		) as unknown as HTMLElement & { setHTML(value: string): void };
		document.body.append(editor);
		await flush();
		editor.setHTML(
			'<pre><code>const value = 1;</code></pre><tp-card>Card</tp-card><audio src="sound.mp3" title="Sound"></audio><p><span data-mathjax-tex="x" data-mathjax-display="false"></span></p>',
		);
		await flush();
		const internal = editor as unknown as {
			editorView: EditorView;
			createCodeBlockNodeView(
				node: ProseMirrorNode,
				view: EditorView,
				getPos: () => number,
			): NodeView;
			createCustomElementNodeView(node: ProseMirrorNode): NodeView;
			createAudioNodeView(node: ProseMirrorNode): NodeView;
			createMathNodeView(
				node: ProseMirrorNode,
				view: EditorView,
				getPos: () => number,
				display: boolean,
			): NodeView;
		};
		const nodes = new Map<string, ProseMirrorNode>();
		internal.editorView.state.doc.descendants((node) => {
			nodes.set(node.type.name, node);
			return true;
		});
		const code = nodes.get("code_block");
		const custom = nodes.get("custom_element");
		const audio = nodes.get("audio");
		const math = nodes.get("math_inline");
		if (
			code === undefined ||
			custom === undefined ||
			audio === undefined ||
			math === undefined
		)
			throw new Error("Expected rich nodes");
		const codeView = internal.createCodeBlockNodeView(
			code,
			internal.editorView,
			() => 0,
		);
		expect(codeView.stopEvent?.(new Event("click"))).toBe(true);
		expect(codeView.ignoreMutation?.({} as MutationRecord)).toBe(true);
		expect(codeView.update?.(code, [], DecorationSet.empty)).toBe(true);
		codeView.destroy?.();
		const customView = internal.createCustomElementNodeView(custom);
		expect(customView.stopEvent?.(new Event("focus"))).toBe(true);
		expect(customView.ignoreMutation?.({} as MutationRecord)).toBe(true);
		expect(customView.update?.(custom, [], DecorationSet.empty)).toBe(true);
		const audioView = internal.createAudioNodeView(audio);
		expect(audioView.ignoreMutation?.({} as MutationRecord)).toBe(true);
		expect(audioView.stopEvent?.(new Event("click"))).toBe(true);
		vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue(undefined);
		audioView.dom
			.querySelector("tp-icon-button")
			?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
		const mathView = internal.createMathNodeView(
			math,
			internal.editorView,
			() => 1,
			false,
		);
		expect(mathView.stopEvent?.(new Event("dblclick"))).toBe(true);
		expect(mathView.ignoreMutation?.({} as MutationRecord)).toBe(true);
		expect(mathView.update?.(math, [], DecorationSet.empty)).toBe(true);
		mathView.destroy?.();
	});

	it("waits for rendered Markdown through immediate, event and timeout paths", async () => {
		const editor = document.createElement(
			"tp-prose-editor",
		) as unknown as HTMLElement & {
			waitForRenderedMarkdownElement(element: Element): Promise<void>;
		};
		const rendered = document.createElement("tp-markdown");
		rendered.setAttribute("data-tp-markdown-rendered", "");
		await editor.waitForRenderedMarkdownElement(rendered);

		const pending = document.createElement("tp-markdown");
		const eventCompletion = editor.waitForRenderedMarkdownElement(pending);
		pending.dispatchEvent(new Event("tp-markdown-rendered"));
		await eventCompletion;

		// Wait for this guard only: flushing every timer also executes recurring
		// work from dynamically loaded components, unrelated to this assertion.
		const schedule = vi.spyOn(window, "setTimeout");
		const timedOut = editor.waitForRenderedMarkdownElement(
			document.createElement("tp-markdown"),
		);
		expect(schedule).toHaveBeenCalledWith(expect.any(Function), 1500);
		await timedOut;
	});

	it("covers guarded commands and alternate toolbar paths", async () => {
		const detached = document.createElement(
			"tp-prose-editor",
		) as unknown as HTMLElement & {
			runCommand(command: string): void;
			runTableCommand(command: () => boolean): boolean;
			toggleDropdownCommand(command: string): boolean;
			openFileInput(input: HTMLInputElement | null): void;
			clearSearch(): void;
			closeTableMenu(): void;
			toggleSearch(): void;
			syncSearchClearButton(): void;
			syncTablePicker(): void;
			readPositiveInteger(value: string, fallback: number): number;
			getTablePickerCell(target: EventTarget | null): HTMLElement | null;
			addTableCaption(): boolean;
			findTableForCaption(): unknown;
			handleToolbarMouseDown(event: MouseEvent): void;
			handleToolbarClick(event: MouseEvent): void;
			handleMenuItemSelect(event: Event): void;
			handleGenericMenuKeydown(event: KeyboardEvent): void;
			handleTableMenuKeydown(event: KeyboardEvent): void;
			handleTablePickerPointerOver(event: PointerEvent): void;
			handleTablePickerClick(event: MouseEvent): void;
		};
		detached.runCommand("format-bold");
		expect(detached.runTableCommand(() => true)).toBe(false);
		expect(detached.toggleDropdownCommand("unknown")).toBe(false);
		expect(detached.toggleDropdownCommand("files")).toBe(true);
		detached.openFileInput(null);
		detached.clearSearch();
		detached.closeTableMenu();
		detached.toggleSearch();
		detached.syncSearchClearButton();
		detached.syncTablePicker();
		expect(detached.readPositiveInteger("", 3)).toBe(3);
		expect(detached.readPositiveInteger("-1", 4)).toBe(4);
		expect(detached.readPositiveInteger("5", 1)).toBe(5);
		expect(detached.getTablePickerCell(null)).toBeNull();
		expect(detached.addTableCaption()).toBe(false);
		expect(detached.findTableForCaption()).toBeNull();
		detached.handleToolbarMouseDown(new MouseEvent("mousedown"));
		detached.handleToolbarClick(new MouseEvent("click"));
		detached.handleMenuItemSelect(new CustomEvent("select", { detail: {} }));
		detached.handleGenericMenuKeydown(
			new KeyboardEvent("keydown", { key: "Enter" }),
		);
		detached.handleTableMenuKeydown(
			new KeyboardEvent("keydown", { key: "Enter" }),
		);
		detached.handleTablePickerPointerOver(new PointerEvent("pointerover"));
		detached.handleTablePickerClick(new MouseEvent("click"));

		const editor = document.createElement(
			"tp-prose-editor",
		) as unknown as HTMLElement & {
			runCommand(command: string): void;
			runHTMLAction(action: string): void;
			runTableAction(action: string): void;
			handleSearchInputKeydown(event: KeyboardEvent): void;
			handleGenericMenuKeydown(event: KeyboardEvent): void;
			renderMathElement(element: HTMLElement): Promise<void>;
		};
		editor.innerHTML = "<p>Text to format</p>";
		document.body.append(editor);
		await flush();
		vi.spyOn(window, "prompt").mockReturnValue("value");
		for (const command of [
			"format-bold",
			"format-clear",
			"format-code",
			"format-code-block",
			"format-list-bulleted",
			"format-list-numbered",
			"format-list-text",
			"format-math",
			"format-header-1",
			"format-header-2",
			"format-header-3",
			"format-header-4",
			"format-header-5",
			"format-header-6",
			"format-italic",
			"format-quote-open",
			"format-strikethrough",
			"format-subscript",
			"format-superscript",
			"format-text",
			"format-underline",
			"insert-horizontal-rule",
			"insert-math-block",
			"insert-markdown-block",
			"insert-markup-asciidoc",
			"insert-markup-html",
			"insert-markup-markdown",
			"insert-markup-restructuredtext",
			"insert-audio",
			"insert-image",
			"insert-video",
			"link",
			"undo",
			"redo",
			"search",
			"more",
		])
			editor.runCommand(command);
		editor.runHTMLAction("code");
		editor.runHTMLAction("render");
		editor.runHTMLAction("editor");
		for (const action of [
			"insert",
			"add-caption",
			"add-row",
			"add-column",
			"delete-row",
			"delete-column",
			"delete-table",
			"unknown",
		]) {
			editor.runTableAction(action);
		}
		const search = editor.querySelector<HTMLInputElement>(
			"[data-tp-prose-editor-search-input]",
		);
		if (search === null) throw new Error("Expected search input");
		search.value = "";
		editor.handleSearchInputKeydown(
			new KeyboardEvent("keydown", { key: "Enter" }),
		);
		search.value = "Text";
		editor.handleSearchInputKeydown(
			new KeyboardEvent("keydown", { key: "Enter", shiftKey: true }),
		);
		editor.handleSearchInputKeydown(
			new KeyboardEvent("keydown", { key: "Escape" }),
		);
		const menu = editor.querySelector<HTMLElement>("tp-menu");
		menu?.dispatchEvent(
			new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
		);
		const emptyMath = document.createElement("span");
		emptyMath.setAttribute("data-mathjax-tex", " ");
		await editor.renderMathElement(emptyMath);
		expect(emptyMath.textContent).toBe("");
	}, 20_000);

	it("collects image, video and audio dialog attributes", async () => {
		const editor = document.createElement(
			"tp-prose-editor",
		) as unknown as HTMLElement & {
			promptMediaAttributes(
				kind: "image" | "video" | "audio",
				filename: string,
				src: string,
			): Promise<Record<string, unknown> | null>;
			normalizeDimension(value: string): string | null;
			getMediaOptionChecked(
				dialog: HTMLElement,
				option: string,
				fallback: boolean,
			): boolean;
		};
		document.body.append(editor);
		await flush();
		expect(editor.normalizeDimension("")).toBeNull();
		expect(editor.normalizeDimension("no")).toBeNull();
		expect(editor.normalizeDimension("-2")).toBeNull();
		expect(editor.normalizeDimension(" 42px ")).toBe("42");

		const imagePromise = editor.promptMediaAttributes(
			"image",
			"photo.png",
			"data:image/png;base64,AA",
		);
		const imageDialog = editor.querySelector<HTMLDialogElement>("dialog");
		if (imageDialog === null) throw new Error("Expected image dialog");
		expect(editor.getMediaOptionChecked(imageDialog, "missing", true)).toBe(
			true,
		);
		const width = imageDialog.querySelector<HTMLInputElement>(
			'input[name="width"]',
		);
		const height = imageDialog.querySelector<HTMLInputElement>(
			'input[name="height"]',
		);
		if (width === null || height === null)
			throw new Error("Expected dimensions");
		width.value = "320";
		width.dispatchEvent(new Event("input"));
		height.value = "200";
		height.dispatchEvent(new Event("input"));
		imageDialog.querySelector<HTMLButtonElement>('button[value="ok"]')?.click();
		expect(await imagePromise).toMatchObject({
			alt: "",
			title: "photo.png",
			width: "320",
			height: "200",
		});

		const videoPromise = editor.promptMediaAttributes(
			"video",
			"movie.mp4",
			"data:video/mp4;base64,AA",
		);
		const videoDialog = editor.querySelector<HTMLDialogElement>("dialog");
		if (videoDialog === null) throw new Error("Expected video dialog");
		required(
			videoDialog.querySelector<HTMLInputElement>('input[name="poster"]'),
		).value = " poster.jpg ";
		videoDialog.querySelector<HTMLButtonElement>('button[value="ok"]')?.click();
		expect(await videoPromise).toMatchObject({
			title: "movie.mp4",
			poster: " poster.jpg ",
		});

		const audioPromise = editor.promptMediaAttributes(
			"audio",
			"sound.mp3",
			"data:audio/mp3;base64,AA",
		);
		const audioDialog = editor.querySelector<HTMLDialogElement>("dialog");
		if (audioDialog === null) throw new Error("Expected audio dialog");
		audioDialog
			.querySelector<HTMLButtonElement>('button[value="cancel"]')
			?.click();
		expect(await audioPromise).toBeNull();
	});

	it("covers file, source-mode and save fallbacks", async () => {
		const editor = document.createElement(
			"tp-prose-editor",
		) as unknown as HTMLElement & {
			setHTMLCodeMode(enabled: boolean): boolean;
			setHTMLRenderMode(enabled: boolean): boolean;
			restoreEditorMode(): boolean;
			insertTextInHTMLSource(text: string): void;
			loadSelectedHTMLFile(event: Event): Promise<void>;
			loadSelectedMarkdownFile(event: Event): Promise<void>;
			loadSelectedMediaFile(
				event: Event,
				kind: "image" | "video" | "audio",
			): Promise<void>;
			loadNaturalMediaSize(
				kind: "image" | "video" | "audio",
				src: string,
			): Promise<{ height: number; width: number } | null>;
			readFileAsDataURL(file: File): Promise<string>;
			saveTextFileAs(
				filename: string,
				content: string,
				type: string,
				normalize?: (value: string) => string,
			): Promise<void>;
			normalizeHTMLFilename(filename: string): string;
			createHTMLDocument(): string;
		};
		expect(editor.setHTMLCodeMode(true)).toBe(false);
		expect(editor.setHTMLRenderMode(true)).toBe(false);
		expect(editor.restoreEditorMode()).toBe(false);
		editor.insertTextInHTMLSource("ignored");
		await editor.loadSelectedHTMLFile(new Event("change"));
		await editor.loadSelectedMarkdownFile(new Event("change"));
		await editor.loadSelectedMediaFile(new Event("change"), "image");
		expect(await editor.loadNaturalMediaSize("audio", "")).toBeNull();
		expect(
			await editor.readFileAsDataURL(new File(["hello"], "hello.txt")),
		).toContain("data:");
		expect(editor.normalizeHTMLFilename("")).toBe("");
		expect(editor.normalizeHTMLFilename(" page ")).toBe("page.html");
		expect(editor.normalizeHTMLFilename("page.xhtml")).toBe("page.xhtml");
		await editor.saveTextFileAs(" ", "body", "text/plain");
		Object.defineProperty(window, "showSaveFilePicker", {
			configurable: true,
			value: undefined,
		});
		const prompt = vi
			.spyOn(window, "prompt")
			.mockReturnValueOnce(null)
			.mockReturnValueOnce(" ");
		await editor.saveTextFileAs("page.txt", "body", "text/plain");
		await editor.saveTextFileAs("page.txt", "body", "text/plain");
		expect(prompt).toHaveBeenCalledTimes(2);

		editor.innerHTML = "<p>Document</p>";
		document.body.append(editor);
		await flush();
		expect(editor.createHTMLDocument()).toContain("<!doctype html>");
		expect(editor.setHTMLCodeMode(true)).toBe(true);
		expect(editor.setHTMLCodeMode(true)).toBe(true);
		editor.insertTextInHTMLSource("<strong>x</strong>");
		expect(editor.setHTMLRenderMode(true)).toBe(true);
		expect(editor.restoreEditorMode()).toBe(true);
		expect(editor.setHTMLCodeMode(false)).toBe(true);
	});
});
