import { TextSelection } from "prosemirror-state";
import type { EditorView } from "prosemirror-view";
import { describe, expect, it, vi } from "vitest";
import { required } from "../../test-helpers/required.js";

import "./prose-editor.js";

import {
	flush,
	getEditor,
	setupProseEditorTests,
	waitFor,
} from "../../test-helpers/prose-editor.js";

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
	setupProseEditorTests();
	it("minimizes and restores editing tools without changing the document", async () => {
		document.body.innerHTML =
			"<tp-prose-editor><p>Keep this text.</p></tp-prose-editor>";
		await flush();
		const editor = getEditor();
		const toggle = required(
			editor.querySelector<HTMLElement>("[data-toolbar-toggle]"),
		);
		const original = editor.getHTML();
		toggle.click();
		expect(editor.hasAttribute("data-toolbar-collapsed")).toBe(true);
		expect(toggle.getAttribute("aria-expanded")).toBe("false");
		expect(toggle.getAttribute("label")).toBe("Restore toolbar");
		expect(editor.querySelector("[contenteditable='true']")).not.toBeNull();
		toggle.click();
		expect(editor.hasAttribute("data-toolbar-collapsed")).toBe(false);
		expect(toggle.getAttribute("aria-expanded")).toBe("true");
		await editor.toggleToolbar();
		expect(editor.hasAttribute("data-toolbar-collapsed")).toBe(true);
		await editor.toggleToolbar();
		expect(editor.hasAttribute("data-toolbar-collapsed")).toBe(false);
		expect(editor.getHTML()).toBe(original);
	});
	it("offers five formats in each file submenu and includes a LaTeX block", async () => {
		document.body.innerHTML =
			"<tp-prose-editor><p>Example</p></tp-prose-editor>";
		await flush();
		const editor = getEditor();
		expect(
			editor.querySelectorAll(
				"[data-tp-prose-editor-file-menu] [data-file-action]",
			),
		).toHaveLength(10);
		for (const action of [
			"load-html",
			"import-asciidoc",
			"import-latex",
			"import-markdown",
			"import-restructuredtext",
			"save-html-as",
			"export-asciidoc",
			"export-latex",
			"export-markdown",
			"export-restructuredtext",
		])
			expect(
				editor.querySelector(`[data-file-action="${action}"]`),
			).not.toBeNull();
		editor
			.querySelector<HTMLElement>('[data-menu-command="insert-markup-latex"]')
			?.click();
		await flush();
		expect(
			editor.querySelector('tp-code-editor[language="latex"]'),
		).not.toBeNull();
		const code = required(
			editor.querySelector<HTMLElement & { setValue(value: string): void }>(
				'tp-code-editor[language="latex"]',
			),
		);
		code.setValue("\\textbf{Block bold}");
		code.dispatchEvent(
			new CustomEvent("tp-code-editor-input", { bubbles: true }),
		);
		await waitFor(() =>
			editor.getHTML().includes("<strong>Block bold</strong>"),
		);
	});
	it("exports native document formatting in five markup languages", async () => {
		document.body.innerHTML =
			"<tp-prose-editor><h2>Heading</h2><p><strong>Bold</strong> and <em>italic</em></p><ul><li>First</li></ul></tp-prose-editor>";
		await flush();
		const editor = getEditor() as ReturnType<typeof getEditor> & {
			getMarkup: (language: string) => Promise<string>;
		};
		expect(await editor.getMarkup("html")).toContain("<strong>Bold</strong>");
		expect(await editor.getMarkup("markdown")).toContain("**Bold**");
		expect(await editor.getMarkup("asciidoc")).toContain("*Bold*");
		expect(await editor.getMarkup("restructuredtext")).toContain("**Bold**");
		const latex = await editor.getMarkup("latex");
		expect(latex).toContain("\\section*{Heading}");
		expect(latex).toContain("\\textbf{Bold}");
		expect(latex).toContain("\\begin{itemize}");
		const { renderLatexToFragment } = await import("@tp/tp-latex");
		expect(renderLatexToFragment(latex).textContent).toContain("Bold");
		expect(renderLatexToFragment(latex).querySelector("h2")?.textContent).toBe(
			"Heading",
		);
	});
	it("exports document tables as native LaTeX with merged cells", async () => {
		document.body.innerHTML =
			'<tp-prose-editor><table><tbody><tr><td colspan="2">Merged</td></tr><tr><td>A</td><td>B</td></tr></tbody></table></tp-prose-editor>';
		await flush();
		const editor = getEditor() as ReturnType<typeof getEditor> & {
			getMarkup: (language: string) => Promise<string>;
		};
		const source = await editor.getMarkup("latex");
		expect(source).toContain("\\begin{tblr}");
		const { renderLatexToFragment } = await import("@tp/tp-latex");
		const root = renderLatexToFragment(source);
		expect(root.querySelector("td")?.colSpan).toBe(2);
		expect(root.textContent).toContain("Merged");
	});
	it("imports LaTeX through the file submenu and preserves bold text", async () => {
		document.body.innerHTML = "<tp-prose-editor></tp-prose-editor>";
		await flush();
		const editor = getEditor();
		const input = required(
			editor.querySelector<HTMLInputElement>(
				"[data-tp-prose-editor-markdown-file]",
			),
		);
		vi.spyOn(input, "click").mockImplementation(() => {});
		editor
			.querySelector<HTMLElement>('[data-file-action="import-latex"]')
			?.click();
		expect(input.accept).toBe(".tex,.latex");
		Object.defineProperty(input, "files", {
			configurable: true,
			value: [
				{
					name: "example.tex",
					text: async () => "\\section*{Imported}\\textbf{LaTeX bold}",
				},
			],
		});
		input.dispatchEvent(new Event("change"));
		await waitFor(() =>
			editor.getHTML().includes("<strong>LaTeX bold</strong>"),
		);
		expect(editor.getHTML()).toContain("Imported");
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
			"insert-markup-latex",
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
});
