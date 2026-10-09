import { afterEach, describe, expect, it, vi } from "vitest";

import "./javascript-viewer/javascript-viewer.js";
import "./prolog-viewer/prolog-viewer.js";
import "./python-viewer/python-viewer.js";
import "./sql-viewer/sql-viewer.js";
import "./typescript-viewer/typescript-viewer.js";
import prologSrcExample from "../../public/docs/components/prolog-viewer/examples/example.json";

const tags = [
	["tp-javascript-viewer", "JavaScript", "javascript-viewer"],
	["tp-prolog-viewer", "Prolog", "prolog-viewer"],
	["tp-python-viewer", "Python", "python-viewer"],
	["tp-sql-viewer", "SQL", "sql-viewer"],
	["tp-typescript-viewer", "TypeScript", "typescript-viewer"],
] as const;

afterEach(() => {
	document.body.replaceChildren();
});

describe("programming viewers", () => {
	it("keeps real line breaks in the Prolog src example", () => {
		const program = prologSrcExample.files.find(
			(file) => file.path === "/program.pl",
		);
		const query = prologSrcExample.files.find(
			(file) => file.path === "/query.pl",
		);
		expect(program?.content).toContain(
			"parent(ada, byron).\nparent(byron, charles).",
		);
		expect(program?.content).toContain(
			"grandparent(Grandparent, Grandchild) :-",
		);
		expect(query?.content).toBe("grandparent(ada, Grandchild).");
		expect(program?.content).not.toContain("\\n");
	});

	it("starts the Prolog viewer with two empty editors", async () => {
		const viewer = document.createElement("tp-prolog-viewer");
		document.body.append(viewer);
		await Promise.resolve();
		const project = (
			viewer as HTMLElement & {
				getProject(): {
					findFile(path: string): { content: string } | undefined;
				};
			}
		).getProject();
		expect(project.findFile("/program.pl")?.content).toBe("");
		expect(project.findFile("/query.pl")?.content).toBe("");
		expect(viewer.querySelectorAll("tp-code-editor")).toHaveLength(2);
	});

	it.each(tags)(
		"renders the compact %s interface",
		async (tag, label, icon) => {
			const viewer = document.createElement(tag);
			document.body.append(viewer);
			await Promise.resolve();

			const languageIcon = viewer.querySelector(
				"[data-tp-programming-viewer-language]",
			);
			expect(languageIcon?.getAttribute("name")).toBe(icon);
			expect(languageIcon?.getAttribute("library")).toBe("components");
			expect(languageIcon?.getAttribute("aria-label")).toBe(label);
			expect(viewer.querySelector("tp-code-editor")).not.toBeNull();
			expect(
				Array.from(viewer.querySelectorAll("tp-code-editor")).every(
					(editor) => !editor.hasAttribute("line-numbers"),
				),
			).toBe(true);
			expect(viewer.querySelector("tp-iframe")).not.toBeNull();
			expect(viewer.querySelector("tp-console")).not.toBeNull();
			expect(
				viewer.querySelector(
					"tp-console [data-tp-console-header-right] tp-copy-code",
				),
			).not.toBeNull();
			expect(viewer.querySelector("tp-filesystem")).toBeNull();
			expect(
				document.getElementById("tp-playground-styles")?.textContent,
			).toContain(
				"[data-tp-programming-viewer-panel='output'] tp-iframe[data-tp-playground-preview] {\n  border: 0;",
			);
			expect(
				viewer
					.querySelector("[data-tp-programming-viewer-code]")
					?.getAttribute("name"),
			).toBe("code");
			expect(
				viewer
					.querySelector("[data-tp-programming-viewer-output]")
					?.getAttribute("label"),
			).toBe("Render");
			expect(
				viewer
					.querySelector("[data-tp-programming-viewer-code]")
					?.getAttribute("aria-pressed"),
			).toBe("false");
			expect(
				viewer.querySelector<HTMLElement>(
					'[data-tp-programming-viewer-panel="code"]',
				)?.hidden,
			).toBe(true);
			viewer
				.querySelector<HTMLElement>("[data-tp-programming-viewer-code]")
				?.click();
			const toolbarButton = viewer.querySelector<HTMLElement>(
				"[data-tp-programming-viewer-editor-toolbar]",
			);
			const editorActions = viewer.querySelector<HTMLElement>(
				"[data-tp-programming-viewer-editor-actions]",
			);
			const codeEditor = viewer.querySelector<HTMLElement>("tp-code-editor");
			expect(
				Array.from(editorActions?.children ?? []).map((child) =>
					child.hasAttribute("data-tp-programming-viewer-editor-toolbar")
						? "editor-toolbar"
						: child.hasAttribute("data-tp-playground-reset")
							? "reset"
							: "run",
				),
			).toEqual(["editor-toolbar", "reset", "run"]);
			expect(editorActions?.hidden).toBe(false);
			expect(toolbarButton?.getAttribute("name")).toBe("keyboard-f1");
			expect(toolbarButton?.hidden).toBe(false);
			toolbarButton?.click();
			expect(codeEditor?.hasAttribute("toolbar")).toBe(true);
		},
	);

	it("fits the shared programming-viewer frame to visual-only content", async () => {
		const viewer = document.createElement("tp-javascript-viewer");
		document.body.append(viewer);
		await Promise.resolve();

		const iframe = viewer.querySelector("tp-iframe") as HTMLElement & {
			contentDocument: Document | null;
			getContentHeight(): number;
		};
		const frameDocument = iframe.contentDocument;
		expect(frameDocument).not.toBeNull();
		if (frameDocument === null) return;

		frameDocument.body.innerHTML = '<div aria-label="Visual result"></div>';
		vi.spyOn(
			frameDocument.body.firstElementChild as Element,
			"getBoundingClientRect",
		).mockReturnValue({ height: 48 } as DOMRect);
		vi.spyOn(iframe, "getContentHeight").mockReturnValue(48);

		iframe.dispatchEvent(new CustomEvent("tp-iframe-load"));

		expect(iframe.hidden).toBe(false);
		expect(iframe.style.blockSize).toBe("48px");
	});

	it("toggles panels while keeping one panel visible", async () => {
		const viewer = document.createElement("tp-javascript-viewer");
		document.body.append(viewer);
		await Promise.resolve();

		const code = viewer.querySelector<HTMLElement>(
			"[data-tp-programming-viewer-code]",
		);
		const output = viewer.querySelector<HTMLElement>(
			"[data-tp-programming-viewer-output]",
		);
		const root = viewer.querySelector<HTMLElement>(
			"[data-tp-programming-viewer-root]",
		);

		expect(root?.dataset.view).toBe("output");
		code?.click();

		code?.click();
		expect(root?.dataset.view).toBe("output");
		expect(
			viewer.querySelector<HTMLElement>(
				"[data-tp-programming-viewer-editor-toolbar]",
			)?.hidden,
		).toBe(true);
		expect(
			viewer.querySelector<HTMLElement>(
				"[data-tp-programming-viewer-editor-actions]",
			)?.hidden,
		).toBe(true);
		expect(code?.getAttribute("aria-pressed")).toBe("false");
		expect(output?.getAttribute("aria-pressed")).toBe("true");
		output?.click();
		expect(root?.dataset.view).toBe("output");
		code?.click();
		expect(root?.dataset.view).toBe("both");
		expect(
			viewer.querySelector<HTMLElement>(
				"[data-tp-programming-viewer-editor-actions]",
			)?.hidden,
		).toBe(false);
	});

	it("shows the console on demand and automatically when an entry is written", async () => {
		const viewer = document.createElement("tp-javascript-viewer");
		document.body.append(viewer);
		await Promise.resolve();

		const button = viewer.querySelector<HTMLElement>(
			"[data-tp-programming-viewer-console]",
		);
		const consoleEl = viewer.querySelector("tp-console") as HTMLElement & {
			log(...values: string[]): void;
			clear(): void;
		};
		expect(
			consoleEl.parentElement?.getAttribute("data-tp-programming-viewer-panel"),
		).toBe("output");
		expect(button?.getAttribute("name")).toBe("terminal");
		expect(button?.getAttribute("aria-pressed")).toBe("false");
		expect(consoleEl.hidden).toBe(true);

		button?.click();
		expect(consoleEl.hidden).toBe(false);
		button?.click();
		expect(consoleEl.hidden).toBe(true);

		consoleEl.log("Hello console");
		expect(consoleEl.hidden).toBe(false);
		expect(button?.getAttribute("aria-pressed")).toBe("true");
		consoleEl.clear();
		expect(consoleEl.hidden).toBe(true);
	});

	it("accepts the viewer-specific JavaScript script type", async () => {
		const viewer = document.createElement("tp-javascript-viewer");
		viewer.innerHTML =
			'<script type="tp/javascript-viewer">console.log("Inline");</script>';
		document.body.append(viewer);
		await Promise.resolve();

		const project = (
			viewer as HTMLElement & {
				getProject(): {
					findFile(path: string): { content: string } | undefined;
				};
			}
		).getProject();
		expect(project.findFile("/main.js")?.content).toBe(
			'console.log("Inline");',
		);
	});

	it("accepts the viewer-specific TypeScript script type", async () => {
		const viewer = document.createElement("tp-typescript-viewer");
		viewer.innerHTML =
			'<script type="tp/typescript-viewer">const answer: number = 42;</script>';
		document.body.append(viewer);
		await Promise.resolve();

		const project = (
			viewer as HTMLElement & {
				getProject(): {
					findFile(path: string): { content: string } | undefined;
				};
			}
		).getProject();
		expect(project.findFile("/main.ts")?.content).toBe(
			"const answer: number = 42;",
		);
	});

	it("reads a script appended after the viewer is connected by the HTML parser", async () => {
		const viewer = document.createElement("tp-python-viewer");
		document.body.append(viewer);
		const script = document.createElement("script");
		script.type = "tp/python-viewer";
		script.textContent = `
      def greet():
          print("Parsed inline")

      greet()
    `;
		viewer.append(script);
		await Promise.resolve();

		const project = (
			viewer as HTMLElement & {
				getProject(): {
					findFile(path: string): { content: string } | undefined;
				};
			}
		).getProject();
		expect(project.findFile("/main.py")?.content).toBe(`def greet():
    print("Parsed inline")

greet()`);
	});

	it("shows and edits the Prolog program and query in tabs", async () => {
		const viewer = document.createElement("tp-prolog-viewer");
		viewer.innerHTML = `
      <script type="tp/prolog-viewer" filename="program.pl">fact(a).</script>
      <script type="tp/prolog-viewer" filename="query.pl">fact(X).</script>
    `;
		document.body.append(viewer);
		await Promise.resolve();

		const tabs = viewer.querySelector("[data-tp-programming-viewer-file-tabs]");
		viewer
			.querySelector<HTMLElement>("[data-tp-programming-viewer-code]")
			?.click();
		const paths = Array.from(
			tabs?.querySelectorAll('[role="tab"], dt') ?? [],
			(tab) => tab.getAttribute("data-value"),
		);
		const editors = viewer.querySelectorAll("tp-code-editor");
		expect(tabs?.localName).toBe("tp-tabs");
		expect(paths).toEqual(["/program.pl", "/query.pl"]);
		expect(editors).toHaveLength(2);

		const queryEditor = editors[1] as HTMLElement & {
			setValue(value: string): void;
		};
		queryEditor.setValue("fact(a).");
		queryEditor.dispatchEvent(new CustomEvent("tp-code-editor-change"));
		const project = (
			viewer as HTMLElement & {
				getProject(): {
					findFile(path: string): { content: string } | undefined;
				};
			}
		).getProject();
		expect(project.findFile("/query.pl")?.content).toBe("fact(a).");
	});

	it("treats one unnamed Prolog script as program.pl with an empty query.pl", async () => {
		const viewer = document.createElement("tp-prolog-viewer");
		viewer.innerHTML = '<script type="tp/prolog">fact(a).</script>';
		document.body.append(viewer);
		await Promise.resolve();

		const project = (
			viewer as HTMLElement & {
				getProject(): {
					findFile(path: string): { content: string } | undefined;
				};
			}
		).getProject();
		expect(project.findFile("/program.pl")?.content).toBe("fact(a).");
		expect(project.findFile("/query.pl")?.content).toBe("");
		const editors = viewer.querySelectorAll("tp-code-editor");
		expect(editors).toHaveLength(2);
		expect(
			(editors[1] as HTMLElement & { getValue(): string }).getValue(),
		).toBe("");
	});

	it("does not add program.pl when only a named query.pl script is provided", async () => {
		const viewer = document.createElement("tp-prolog-viewer");
		viewer.innerHTML =
			'<script type="tp/prolog" filename="query.pl">unknown_predicate(X).</script>';
		document.body.append(viewer);
		await Promise.resolve();

		const project = (
			viewer as HTMLElement & {
				getProject(): {
					findFile(path: string): { content: string } | undefined;
				};
			}
		).getProject();
		expect(project.findFile("/program.pl")).toBeUndefined();
		expect(project.findFile("/query.pl")?.content).toBe(
			"unknown_predicate(X).",
		);
		expect(viewer.querySelectorAll("tp-code-editor")).toHaveLength(1);
	});

	it("shows the SQL tables and query in tabs", async () => {
		const viewer = document.createElement("tp-sql-viewer");
		viewer.innerHTML = `
      <script type="tp/sql-viewer" filename="tables.sql">CREATE TABLE values_list (value INTEGER);</script>
      <script type="tp/sql-viewer" filename="query.sql">SELECT value FROM values_list;</script>
    `;
		document.body.append(viewer);
		await Promise.resolve();

		const project = (
			viewer as HTMLElement & {
				getProject(): {
					findFile(path: string): { content: string } | undefined;
				};
			}
		).getProject();
		expect(project.findFile("/tables.sql")?.content).toBe(
			"CREATE TABLE values_list (value INTEGER);",
		);
		expect(project.findFile("/query.sql")?.content).toBe(
			"SELECT value FROM values_list;",
		);
		expect(viewer.querySelectorAll("tp-code-editor")).toHaveLength(2);
		const tabs = viewer.querySelector("[data-tp-programming-viewer-file-tabs]");
		viewer
			.querySelector<HTMLElement>("[data-tp-programming-viewer-code]")
			?.click();
		expect(tabs?.localName).toBe("tp-tabs");
		expect(
			Array.from(tabs?.querySelectorAll('[role="tab"], dt') ?? [], (tab) =>
				tab.getAttribute("data-value"),
			),
		).toEqual(["/tables.sql", "/query.sql"]);
	});

	it("treats one unnamed SQL script as tables.sql with an empty query.sql", async () => {
		const viewer = document.createElement("tp-sql-viewer");
		viewer.innerHTML =
			'<script type="tp/sql">CREATE TABLE items (id INTEGER);</script>';
		document.body.append(viewer);
		await Promise.resolve();

		const project = (
			viewer as HTMLElement & {
				getProject(): {
					findFile(path: string): { content: string } | undefined;
				};
			}
		).getProject();
		expect(project.findFile("/tables.sql")?.content).toBe(
			"CREATE TABLE items (id INTEGER);",
		);
		expect(project.findFile("/query.sql")?.content).toBe("");
		expect(viewer.querySelectorAll("tp-code-editor")).toHaveLength(2);
	});
});
