/**
 * @module components/playground/examples-test
 * @summary Tests for playground example catalog resolution.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { required } from "../../test-helpers/required.js";

beforeEach(() => {
	// Source loading does not require CodeMirror layout measurements in jsdom.
	vi.stubGlobal(
		"requestAnimationFrame",
		vi.fn(() => 0),
	);
});

import type { TpFile } from "../filesystem/filesystem.types.js";
import type { TpExecutionDocument } from "./playground.js";
import { TpPlayground } from "./playground.js";
import { TpProject } from "./project.js";

class TpPlaygroundExampleFixture extends TpPlayground<TpProject> {
	public kind = "base";

	public canTest = false;

	public initialFiles: TpFile[] = [];

	public initialTest: string | undefined;

	/** Snapshot passed to the isolated test builder. */
	public testedProject: TpProject | undefined;

	/** Snapshot passed to the execution builder by the Run button. */
	public executedProject: TpProject | undefined;

	/** Captures tests without launching a language runtime. */
	protected override async buildTestDocument(
		project: TpProject,
	): Promise<TpExecutionDocument> {
		this.testedProject = project;
		return { html: "<main>Tests</main>" };
	}

	public readExampleGroup(): string {
		return this.exampleGroup;
	}

	public readExampleCategory(): string {
		return this.exampleCategory;
	}

	protected override getPlaygroundKind(): string {
		return this.kind;
	}

	protected override get supportsTestExecution(): boolean {
		return this.canTest;
	}

	protected override createEmptyProject(): TpProject {
		return new TpProject({ files: [] });
	}

	protected override createInitialProject(): TpProject {
		return new TpProject({
			test: this.initialTest,
			files: this.initialFiles,
		});
	}

	protected override async buildExecutionDocument(
		project: TpProject,
	): Promise<TpExecutionDocument> {
		this.executedProject = project.clone();
		return { html: "<!doctype html><html><body></body></html>" };
	}
}

if (!customElements.get("tp-playground-example-fixture")) {
	customElements.define(
		"tp-playground-example-fixture",
		TpPlaygroundExampleFixture,
	);
}

async function settle(): Promise<void> {
	await Promise.resolve();
	await new Promise<void>((resolve) => {
		setTimeout(resolve, 0);
	});
	await Promise.resolve();
}

function createJsonResponse(value: unknown): Response {
	return {
		ok: true,
		json: async () => value,
		text: async () => JSON.stringify(value),
	} as Response;
}

function createTextResponse(value: string): Response {
	return {
		ok: true,
		json: async () => JSON.parse(value) as unknown,
		text: async () => value,
	} as Response;
}

describe("TpPlayground example groups", () => {
	afterEach(() => {
		document.body.innerHTML = "";
		vi.unstubAllGlobals();
	});

	it("resizes playground output after loading, growing, shrinking and clearing content", async () => {
		const fixture = new TpPlaygroundExampleFixture();
		document.body.append(fixture);
		await settle();
		const iframe = required(fixture.querySelector("tp-iframe"));
		const frameDocument = required(iframe.contentDocument);
		frameDocument.body.innerHTML = "<p>6 × 7 = 42</p>";
		const measure = vi.spyOn(iframe, "getContentHeight").mockReturnValue(40);
		iframe.dispatchEvent(new CustomEvent("tp-iframe-load"));
		expect(iframe.style.blockSize).toBe("40px");
		expect(iframe.hidden).toBe(false);
		measure.mockReturnValue(240);
		frameDocument.body.append(frameDocument.createElement("p"));
		await vi.waitFor(() => expect(iframe.style.blockSize).toBe("240px"));
		measure.mockReturnValue(60);
		frameDocument.body.innerHTML = "<p>Short result</p>";
		await vi.waitFor(() => expect(iframe.style.blockSize).toBe("60px"));
		frameDocument.body.replaceChildren();
		await vi.waitFor(() => expect(iframe.hidden).toBe(true));
		frameDocument.body.innerHTML = "<p>New result</p>";
		await vi.waitFor(() => expect(iframe.hidden).toBe(false));
		expect(iframe.style.blockSize).toBe("60px");
		fixture.remove();
		measure.mockReturnValue(500);
		frameDocument.body.innerHTML = "<p>Detached result</p>";
		await settle();
		expect(iframe.style.blockSize).toBe("60px");
	});

	it("revives a hidden output before running the next document", async () => {
		const fixture = new TpPlaygroundExampleFixture();
		document.body.append(fixture);
		await settle();
		const iframe = required(fixture.querySelector("tp-iframe"));
		iframe.dispatchEvent(new CustomEvent("tp-iframe-load"));
		expect(iframe.hidden).toBe(true);
		await fixture.run();
		expect(iframe.hidden).toBe(false);
		expect(iframe.style.blockSize).toBe("1px");
		// The outgoing document must no longer hide the incoming preview.
		required(iframe.contentDocument).body.append(document.createElement("p"));
		await settle();
		expect(iframe.hidden).toBe(false);
	});

	it("keeps the shared editor in the active tab panel through selection, closing and reset", async () => {
		const fixture = new TpPlaygroundExampleFixture();
		document.body.append(fixture);
		fixture.setProject(
			new TpProject({
				files: [
					{
						path: "/first.js",
						content: "const first = 1;",
						language: "javascript",
					},
					{
						path: "/second.js",
						content: "const second = 2;",
						language: "javascript",
						readonly: true,
					},
				],
			}),
		);
		fixture.openFile("/first.js");
		await settle();
		const editor = required(fixture.querySelector("tp-code-editor"));
		const tabs = required(fixture.querySelector("tp-tabs"));
		const checkPanel = (path: string): void => {
			const panel = required(editor.parentElement);
			expect(panel.parentElement).toBe(tabs);
			expect(panel.getAttribute("role")).toBe("tabpanel");
			expect(panel.getAttribute("data-value")).toBe(path);
			expect(panel.hidden).toBe(false);
			expect(fixture.querySelectorAll("tp-code-editor")).toHaveLength(1);
		};
		checkPanel("/first.js");
		editor.setValue("const first = 10;");
		editor.dispatchEvent(
			new CustomEvent("tp-code-editor-change", {
				detail: { value: editor.getValue() },
			}),
		);
		fixture.openFile("/second.js");
		await settle();
		checkPanel("/second.js");
		expect(editor.getValue()).toBe("const second = 2;");
		expect(editor.hasAttribute("readonly")).toBe(true);
		required(
			tabs.querySelector<HTMLElement>('[role="tab"][data-value="/first.js"]'),
		).click();
		await settle();
		checkPanel("/first.js");
		expect(editor.getValue()).toBe("const first = 10;");
		expect(editor.hasAttribute("readonly")).toBe(false);
		fixture.closeFile("/first.js");
		await settle();
		checkPanel("/second.js");
		fixture.closeFile("/second.js");
		await settle();
		expect(fixture.querySelector("tp-code-editor")).toBeNull();
		expect(tabs.querySelector('[role="tabpanel"]')).toBeNull();
		fixture.reset();
		fixture.openFile("/first.js");
		await settle();
		checkPanel("/first.js");
		expect(editor.getValue()).toBe("const first = 1;");
		fixture.closeFile("/first.js");
		fixture.remove();
		document.body.append(fixture);
		fixture.setProject(
			new TpProject({
				files: [
					{
						path: "/first.js",
						content: "const first = 3;",
						language: "javascript",
					},
				],
			}),
		);
		fixture.openFile("/first.js");
		await settle();
		checkPanel("/first.js");
		expect(editor.getValue()).toBe("const first = 3;");
	});

	it("uses tp-switcher between the work area and the output area", async () => {
		const fixture = document.createElement("tp-playground-example-fixture");
		document.body.append(fixture);
		await Promise.resolve();

		const root = fixture.querySelector("[data-tp-playground-root]");
		const toolbar = root?.querySelector(
			":scope > [data-tp-playground-toolbar]",
		);
		const switcher = root?.querySelector(
			":scope > tp-switcher[data-tp-playground-switcher]",
		);
		const workGroup = switcher?.querySelector(
			":scope > [data-tp-playground-work-group]",
		);
		const previewGroup = switcher?.querySelector(
			":scope > [data-tp-playground-preview-group]",
		);

		expect(toolbar).not.toBeNull();
		expect(toolbar?.tagName.toLowerCase()).toBe("tp-toolbar");
		expect(
			toolbar
				?.querySelector("[data-tp-playground-language-help] tp-icon")
				?.getAttribute("size"),
		).toBe("1em");
		expect(
			toolbar?.querySelector(
				'tp-icon-button[data-tp-playground-reset][name="refresh"]',
			),
		).not.toBeNull();
		expect(
			toolbar?.querySelector(
				'tp-icon-button[data-tp-playground-test][name="test-tube-off"]',
			),
		).not.toBeNull();
		expect(
			toolbar?.querySelector(
				"tp-icon-button[data-tp-playground-test][disabled]",
			),
		).not.toBeNull();
		expect(
			toolbar?.querySelector(
				'tp-icon-button[data-tp-playground-run][name="play"]',
			),
		).not.toBeNull();
		expect(switcher).not.toBeNull();
		expect(
			workGroup?.querySelector("[data-tp-playground-main-splitter]"),
		).not.toBeNull();
		expect(workGroup?.querySelector("[data-tp-playground-toolbar]")).toBeNull();
		expect(
			previewGroup?.querySelector("tp-iframe[data-tp-playground-preview]"),
		).not.toBeNull();
		expect(
			previewGroup?.querySelector("tp-console[data-tp-playground-console]"),
		).not.toBeNull();

		fixture.remove();
	});

	it("loads a single source through src and preserves its priority and load event", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue(new Response('console.log("single");')),
		);
		const fixture = new TpPlaygroundExampleFixture();
		fixture.kind = "javascript";
		fixture.setAttribute("src", "/example.js?v=1");
		fixture.setAttribute("repository", "/ignored/");
		const onLoad = vi.fn();
		fixture.addEventListener("tp-playground-src-load", onLoad);
		document.body.append(fixture);
		await settle();
		expect(fixture.getProject().entry).toBe("/example.js");
		expect(fixture.getProject().findFile("/example.js")?.content).toBe(
			'console.log("single");',
		);
		expect(fixture.getProject().findFile("/index.html")?.content).toBe(
			'<main id="app"></main>',
		);
		expect(onLoad).toHaveBeenCalledOnce();
	});

	it.each(["src", "repository"])(
		"restores the initial project when %s returns to Default",
		async (attribute) => {
			const fixture = new TpPlaygroundExampleFixture();
			fixture.initialFiles = [
				{ path: "/main.js", language: "javascript", content: "default" },
			];
			document.body.append(fixture);
			await settle();
			const initial = fixture.getProject().toJSON();
			vi.stubGlobal(
				"fetch",
				vi.fn(() => new Promise<Response>(() => {})),
			);
			fixture.setAttribute(attribute, "/pending");
			fixture.setProject(
				new TpProject({
					files: [
						{ path: "/loaded.js", language: "javascript", content: "loaded" },
					],
				}),
			);
			const run = vi.spyOn(fixture, "run");
			fixture.removeAttribute(attribute);
			await settle();
			expect(fixture.getProject().toJSON()).toEqual(initial);
			expect(fixture.querySelector("tp-code-editor")?.getValue()).toBe(
				"default",
			);
			expect(run).toHaveBeenCalledOnce();
		},
	);

	it.each(["src", "repository"])(
		"clears previous output before loading %s and displays only its loading error",
		async (attribute) => {
			const fixture = new TpPlaygroundExampleFixture();
			document.body.append(fixture);
			await settle();
			const output = required(fixture.querySelector("tp-console"));
			output.log("Previous successful result");
			const project = fixture.getProject().toJSON();
			let finish: (response: Response) => void = () => {};
			vi.stubGlobal(
				"fetch",
				vi.fn(
					() =>
						new Promise<Response>((resolve) => {
							finish = resolve;
						}),
				),
			);
			const errorLog = vi.spyOn(console, "error").mockImplementation(() => {});
			try {
				fixture.setAttribute(attribute, "/file-unknown.json");
				expect(output.getEntries()).toEqual([]);
				output.log("Late output from the previous project");
				finish(new Response("Missing file", { status: 404 }));
				await settle();
				expect(output.getEntries()).toHaveLength(1);
				expect(output.getEntries()[0]?.kind).toBe("error");
				expect(output.getValue()).toContain("file-unknown.json");
				expect(output.getValue()).toContain("404");
				expect(fixture.getProject().toJSON()).toEqual(project);
			} finally {
				errorLog.mockRestore();
			}
		},
	);

	it("ignores a source that finishes loading after returning to Default", async () => {
		const fixture = new TpPlaygroundExampleFixture();
		fixture.kind = "javascript";
		fixture.initialFiles = [
			{ path: "/main.js", language: "javascript", content: "default" },
		];
		document.body.append(fixture);
		await settle();
		let finish: (response: Response) => void = () => {};
		vi.stubGlobal(
			"fetch",
			vi.fn(
				() =>
					new Promise<Response>((resolve) => {
						finish = resolve;
					}),
			),
		);
		const onLoad = vi.fn();
		fixture.addEventListener("tp-playground-src-load", onLoad);
		fixture.setAttribute("src", "/slow.js");
		fixture.removeAttribute("src");
		finish(createTextResponse("late source"));
		await settle();
		expect(fixture.getProject().findFile("/main.js")?.content).toBe("default");
		expect(onLoad).not.toHaveBeenCalled();
	});

	it("builds tests on a copy without altering learner files or the initial project", async () => {
		const fixture = new TpPlaygroundExampleFixture();
		fixture.initialFiles = [
			{ path: "/main.js", language: "javascript", content: "original" },
		];
		document.body.append(fixture);
		await settle();
		const before = fixture.getProject().toJSON();
		const execution = await fixture.createTestDocument({
			path: "/main.test.js",
			language: "javascript",
			content: "tests",
		});
		expect(execution.html).toBe("<main>Tests</main>");
		expect(fixture.testedProject?.test).toBe("/main.test.js");
		expect(fixture.testedProject?.findFile("/main.test.js")?.content).toBe(
			"tests",
		);
		expect(fixture.getProject().toJSON()).toEqual(before);
	});

	it("loads a complete project from the src JSON attribute", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn(async (input: RequestInfo | URL) => {
				const url = String(input);
				if (url.endsWith("/project.json")) {
					return createJsonResponse({
						name: "Loaded project",
						entry: "/main.js",
						files: [
							{
								path: "/main.js",
								content: 'console.log("loaded");',
								language: "javascript",
							},
						],
					});
				}

				return { ok: false, status: 404 } as Response;
			}),
		);

		const fixture = document.createElement(
			"tp-playground-example-fixture",
		) as TpPlaygroundExampleFixture;
		const onLoad = vi.fn();
		fixture.addEventListener("tp-playground-src-load", onLoad);
		fixture.setAttribute("src", "/project.json");
		document.body.append(fixture);
		await settle();

		const project = fixture.getProject();
		expect(project.name).toBe("Loaded project");
		expect(project.entry).toBe("/main.js");
		expect(project.findFile("/main.js")?.content).toBe(
			'console.log("loaded");',
		);
		expect(onLoad).toHaveBeenCalledOnce();
		expect(
			(required(onLoad.mock.calls[0]?.[0]) as CustomEvent).detail,
		).toMatchObject({
			src: "/project.json",
			project: { name: "Loaded project", entry: "/main.js" },
		});

		const editor = required(fixture.querySelector("tp-code-editor"));
		editor.setValue('console.log("edited");');
		editor.dispatchEvent(
			new CustomEvent("tp-code-editor-change", {
				detail: { value: editor.getValue() },
			}),
		);
		required(
			fixture.querySelector<HTMLButtonElement>(
				"[data-tp-playground-run] button",
			),
		).click();
		await settle();
		expect(fixture.executedProject?.findFile("/main.js")?.content).toBe(
			'console.log("edited");',
		);

		fixture.removeAttribute("src");
		await settle();
		expect(fixture.getProject().files).toEqual([]);
		expect(fixture.executedProject?.files).toEqual([]);
	});

	it("loads a repository project from project.json and .files.json", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn(async (input: RequestInfo | URL) => {
				const url = String(input);
				if (url.endsWith("/repo/project.json")) {
					return createJsonResponse({
						name: "Repository project",
						entry: "/main.py",
					});
				}

				if (url.endsWith("/repo/.files.json")) {
					return createJsonResponse({
						files: ["main.py"],
					});
				}

				if (url.endsWith("/repo/main.py")) {
					return createTextResponse('print("repository")');
				}

				return { ok: false, status: 404 } as Response;
			}),
		);

		const fixture = document.createElement(
			"tp-playground-example-fixture",
		) as TpPlaygroundExampleFixture;
		const onLoad = vi.fn();
		fixture.addEventListener("tp-playground-repository-load", onLoad);
		fixture.setAttribute("repository", "/repo");
		document.body.append(fixture);
		await settle();

		const project = fixture.getProject();
		expect(project.name).toBe("Repository project");
		expect(project.entry).toBe("/main.py");
		expect(project.findFile("/main.py")?.language).toBe("python");
		expect(project.findFile("/main.py")?.content).toBe('print("repository")');
		expect(onLoad).toHaveBeenCalledOnce();
		expect(
			(required(onLoad.mock.calls[0]?.[0]) as CustomEvent).detail,
		).toMatchObject({
			repository: "/repo",
			project: { name: "Repository project", entry: "/main.py" },
		});
	});

	it("loads an inline project from script type tp/json", async () => {
		const fixture = document.createElement(
			"tp-playground-example-fixture",
		) as TpPlaygroundExampleFixture;
		fixture.innerHTML = `
      <script type="tp/json">
        {
          "name": "Inline project",
          "entry": "/main.sql",
          "files": [
            {
              "path": "/main.sql",
              "content": "select 1;",
              "language": "sql"
            }
          ]
        }
      </script>
    `;

		document.body.append(fixture);
		await settle();

		const project = fixture.getProject();
		expect(project.name).toBe("Inline project");
		expect(project.entry).toBe("/main.sql");
		expect(project.findFile("/main.sql")?.content).toBe("select 1;");
	});

	it("enables the test button only when a test file exists", async () => {
		const fixture = document.createElement(
			"tp-playground-example-fixture",
		) as TpPlaygroundExampleFixture;

		fixture.canTest = true;
		fixture.initialFiles = [
			{
				path: "/main.js",
				content: "export const value = 1;",
			},
			{
				path: "/main.test.js",
				content: 'import { value } from "./main.js";',
			},
		];

		document.body.append(fixture);
		await Promise.resolve();

		const testButton = fixture.querySelector(
			"tp-icon-button[data-tp-playground-test]",
		);

		expect(testButton?.getAttribute("name")).toBe("test-tube");
		expect(testButton?.hasAttribute("disabled")).toBe(false);

		fixture.remove();
	});

	it("uses the examples catalog playgrounds category by default", () => {
		const fixture = document.createElement(
			"tp-playground-example-fixture",
		) as TpPlaygroundExampleFixture;

		expect(fixture.readExampleCategory()).toBe("playgrounds");
	});

	it.each([
		["html", "html"],
		["javascript", "js"],
		["python", "py"],
		["sql", "sql"],
		["typescript", "ts"],
	])("maps playground kind %s to examples group %s", (kind, group) => {
		const fixture = document.createElement(
			"tp-playground-example-fixture",
		) as TpPlaygroundExampleFixture;
		fixture.kind = kind;

		expect(fixture.readExampleGroup()).toBe(group);
	});
});
