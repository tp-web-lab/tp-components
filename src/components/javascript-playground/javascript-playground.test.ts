import { afterEach, describe, expect, it, vi } from "vitest";
import {
	TpJavascriptPlayground,
	TpJavascriptProject,
} from "./javascript-playground.js";

afterEach(() => {
	document.body.replaceChildren();
	vi.restoreAllMocks();
	vi.unstubAllGlobals();
});

describe("<tp-javascript-playground>", () => {
	it("covers project data and the executable language contract", async () => {
		const project = new TpJavascriptProject({
			name: "js",
			entry: "/main.js",
			test: "/main.test.js",
			importmap: { imports: { pkg: "/pkg.js" } },
			files: [
				{
					path: "/index.html",
					language: "html",
					content: '<button id="btn">Click</button>',
				},
				{ path: "/main.js", language: "javascript", content: "console.log(1)" },
				{
					path: "/main.test.js",
					language: "javascript",
					content: "console.assert(true)",
				},
			],
		});
		expect(project.clone().toJSON()).toEqual(project.toJSON());
		const element = new TpJavascriptPlayground();
		document.body.append(element);
		await Promise.resolve();
		const api = element as unknown as Record<
			string,
			(...args: unknown[]) => unknown
		>;
		const empty = api.createEmptyProject?.() as TpJavascriptProject;
		expect(api.getPlaygroundKind?.()).toBe("javascript");
		expect(api.getLanguageIconName?.()).toBe("file_type_javascript");
		expect(api.resolveEntry?.(empty)).toBe("/main.js");
		expect(api.createNewProject?.()).toBeInstanceOf(TpJavascriptProject);
		expect(api.createClearProject?.()).toBeInstanceOf(TpJavascriptProject);
		expect(api.normalizeProject?.(project)).toBeInstanceOf(TpJavascriptProject);
		const execution = (await api.buildExecutionDocument?.(project)) as {
			html: string;
			cleanup?: () => void;
		};
		expect(execution).toMatchObject({ html: expect.any(String) });
		expect(execution.html).toContain('<button id="btn">Click</button>');
		execution.cleanup?.();
		const testDocument = (await api.buildTestDocument?.(project)) as {
			html: string;
			cleanup?: () => void;
		};
		const parsed = new DOMParser().parseFromString(
			testDocument.html,
			"text/html",
		);
		expect(parsed.querySelector("#btn")?.textContent).toBe("Click");
		const externalScripts = [...parsed.querySelectorAll("script[src]")];
		expect(externalScripts).toHaveLength(2);
		for (const script of externalScripts)
			expect(script.getAttribute("crossorigin")).toBe("anonymous");
		testDocument.cleanup?.();
		expect(api.getLanguageHelp?.()).toContain("JavaScript");
		expect(api.getAdditionalToolbarMenuItems?.()).toContain("Import map");
		expect(
			api.createProjectFromExample?.(
				{ id: "sample", importmap: { imports: {} } },
				[],
			),
		).toBeInstanceOf(TpJavascriptProject);
		vi.spyOn(element, "run").mockResolvedValue();
		for (const action of [
			"javascript-importmap-lit",
			"javascript-importmap-shoelace",
			"javascript-importmap-none",
		])
			expect(api.handleAdditionalToolbarAction?.(action)).toBe(true);
		expect(api.handleAdditionalToolbarAction?.("unknown")).toBe(false);
		expect(
			api.normalizeProject?.(
				new TpJavascriptProject({
					files: [
						{ path: "/fallback.js", language: "javascript", content: "" },
					],
				}),
			),
		).toMatchObject({ entry: "/fallback.js" });
		expect(api.resolveEntry?.(new TpJavascriptProject())).toBeNull();
		await expect(
			api.buildExecutionDocument?.(new TpJavascriptProject()),
		).rejects.toThrow("entry");
		element.setAttribute("execution-scope", "notebook");
		expect(
			((await api.buildExecutionDocument?.(project)) as { html: string })?.html,
		).toContain("notebook");
	});
});

// Layout writes during ResizeObserver delivery produce a loop error in Safari.
describe("playground preview sizing", () => {
	it("defers resize writes, follows growing and shrinking content, and ignores stale documents", () => {
		const callbacks: (() => void)[] = [];
		vi.stubGlobal("requestAnimationFrame", (callback: () => void) => {
			callbacks.push(callback);
			return callbacks.length;
		});
		let notifyResize = () => {};
		vi.stubGlobal(
			"ResizeObserver",
			class {
				constructor(callback: () => void) {
					notifyResize = callback;
				}
				observe() {}
				disconnect() {}
			},
		);
		const element = new TpJavascriptPlayground();
		const frame = document.createElement("div");
		const content = document.implementation.createHTMLDocument();
		content.body.innerHTML = "<p>Preview</p>";
		let height = 100;
		const measure = vi.fn(() => height);
		const iframe = Object.assign(frame, {
			contentDocument: content,
			getContentHeight: measure,
		});
		const internals = element as unknown as {
			iframeEl: typeof iframe;
			handleViewerIframeLoad: () => void;
			viewerIframeResizeObserver: ResizeObserver | null;
			viewerIframeMutationObserver: MutationObserver | null;
		};
		internals.iframeEl = iframe;
		internals.handleViewerIframeLoad();
		expect(frame.style.blockSize).toBe("100px");
		measure.mockClear();
		for (const nextHeight of [300, 50]) {
			height = nextHeight;
			notifyResize();
			notifyResize();
			expect(measure).not.toHaveBeenCalled();
			expect(callbacks).toHaveLength(1);
			callbacks.shift()?.();
			expect(frame.style.blockSize).toBe(`${nextHeight}px`);
			measure.mockClear();
		}
		notifyResize();
		iframe.contentDocument = document.implementation.createHTMLDocument();
		callbacks.shift()?.();
		expect(measure).not.toHaveBeenCalled();
		internals.viewerIframeResizeObserver?.disconnect();
		internals.viewerIframeMutationObserver?.disconnect();
	});
});

describe("switching from execution to tests", () => {
	it("revives a hidden preview and releases the outgoing document before navigation", async () => {
		const element = new TpJavascriptPlayground();
		const frame = document.createElement("div");
		frame.hidden = true;
		const cleanup = vi.fn();
		const disconnectResize = vi.fn();
		const disconnectMutation = vi.fn();
		const nextCleanup = vi.fn();
		const internals = element as unknown as {
			iframeEl: HTMLElement;
			cleanupExecution: () => void;
			viewerIframeResizeObserver: { disconnect: () => void } | null;
			viewerIframeMutationObserver: { disconnect: () => void } | null;
			syncProjectFromFilesystem: () => void;
			buildTestDocument: () => Promise<{ html: string; cleanup: () => void }>;
		};
		Object.assign(internals, {
			iframeEl: frame,
			cleanupExecution: cleanup,
			viewerIframeResizeObserver: { disconnect: disconnectResize },
			viewerIframeMutationObserver: { disconnect: disconnectMutation },
		});
		vi.spyOn(internals, "syncProjectFromFilesystem").mockImplementation(
			() => {},
		);
		vi.spyOn(internals, "buildTestDocument").mockResolvedValue({
			html: "<p>Tests</p>",
			cleanup: nextCleanup,
		});
		await element.test();
		expect(frame.hidden).toBe(false);
		expect(frame.style.blockSize).toBe("1px");
		expect(frame.getAttribute("srcdoc")).toBe("<p>Tests</p>");
		expect(cleanup).toHaveBeenCalledOnce();
		expect(disconnectResize).toHaveBeenCalledOnce();
		expect(disconnectMutation).toHaveBeenCalledOnce();
		expect(internals.viewerIframeResizeObserver).toBeNull();
		expect(internals.viewerIframeMutationObserver).toBeNull();
		expect(internals.cleanupExecution).toBe(nextCleanup);
	});
});
