import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "../html-viewer/html-viewer.js";
import { TpMarkupViewer } from "./markup-viewer.js";

class TestMarkupViewer extends TpMarkupViewer<"render" | "tree", URL> {
	protected readonly sourceLanguage = "custom";
	protected readonly outputModes = [
		{ value: "render" as const, label: "Render" },
		{ value: "tree" as const, label: "Tree" },
	];
	protected readonly viewerClassName = "test-viewer<&";
	public disposed = false;
	protected readInlineSource() {
		return {
			label: "Inline",
			source: this.textContent?.trim() || "inline",
			context: new URL(document.baseURI),
		};
	}
	protected createExternalContext(url: URL) {
		return url;
	}
	protected async renderOutput(
		source: string,
		mode: "render" | "tree",
		container: HTMLElement,
	) {
		if (source === "throw") throw "render failed";
		container.textContent = `${mode}:${source}`;
	}
	protected override disposeViewer() {
		this.disposed = true;
	}
	public extract(example: { label: string; source: string; context: URL }) {
		return this.extractExamples(example);
	}
	public resetSource(example: { label: string; source: string; context: URL }) {
		return this.getResetSource(example);
	}
	public requestRender() {
		this.requestViewerRender();
	}
	public syncEditor(
		editor: Parameters<TestMarkupViewer["resyncEditorHeight"]>[0],
	) {
		this.resyncEditorHeight(editor);
	}
	public load() {
		return this.loadExamples();
	}
}

if (!customElements.get("test-markup-viewer"))
	customElements.define("test-markup-viewer", TestMarkupViewer);

beforeEach(() => {
	vi.stubGlobal(
		"requestAnimationFrame",
		vi.fn(() => 0),
	);
});

afterEach(() => {
	document.body.replaceChildren();
	vi.unstubAllGlobals();
});

describe("markup viewer editor toolbar control", () => {
	it.each([false, true])(
		"uses the viewer identity for its icon with lite=%s",
		async (lite) => {
			const viewer = document.createElement("test-markup-viewer");
			viewer.toggleAttribute("lite", lite);
			document.body.append(viewer);
			await vi.waitFor(() => {
				const icon = viewer.querySelector(".tp-markup-viewer-language");
				expect(icon?.getAttribute("library")).toBe("components");
				expect(icon?.getAttribute("name")).toBe("test-viewer<&");
			});
		},
	);

	it("places the control beside reset and run in pedagogical mode", async () => {
		const viewer = document.createElement("tp-html-viewer");
		viewer.innerHTML = "<template><p>Hello</p></template>";
		document.body.append(viewer);
		await vi.waitFor(() =>
			expect(
				viewer.querySelector('[data-role="editor-actions"]'),
			).not.toBeNull(),
		);

		const editorActions = viewer.querySelector('[data-role="editor-actions"]');
		expect(
			editorActions?.querySelector('[data-role="toggle-editor-toolbar"]'),
		).not.toBeNull();
		expect(editorActions?.querySelector('[data-role="reset"]')).not.toBeNull();
		expect(editorActions?.querySelector('[data-role="run"]')).not.toBeNull();
		expect(
			viewer.querySelector(
				'.tp-markup-viewer-toolbar [data-role="toggle-editor-toolbar"]',
			),
		).not.toBeNull();
		const outputActions = viewer.querySelector<HTMLElement>(
			'[data-role="output-actions"]',
		);
		expect(
			outputActions?.querySelector('[name="language-html"][library="tp"]'),
		).not.toBeNull();
		expect(
			outputActions?.querySelector('[name="tree"][library="components"]'),
		).not.toBeNull();
		expect(
			outputActions?.querySelector('tp-divider[orientation="vertical"]'),
		).not.toBeNull();
		expect(viewer.querySelector("tp-switcher")?.getAttribute("gap")).toBe("0");

		expect(viewer.dataset.layout).toBe("output");
		expect((editorActions as HTMLElement).hidden).toBe(true);
		viewer.querySelector<HTMLElement>('[data-role="toggle-source"]')?.click();

		viewer.querySelector<HTMLElement>('[data-role="toggle-source"]')?.click();
		expect((editorActions as HTMLElement).hidden).toBe(true);
		viewer.querySelector<HTMLElement>('[data-role="toggle-source"]')?.click();
		expect((editorActions as HTMLElement).hidden).toBe(false);
		viewer.querySelector<HTMLElement>('[data-role="toggle-output"]')?.click();
		expect(outputActions?.hidden).toBe(true);
	});

	it("appears with the source panel and toggles the code editor toolbar", async () => {
		const viewer = document.createElement("tp-html-viewer");
		viewer.setAttribute("lite", "");
		viewer.innerHTML = "<template><p>Hello</p></template>";
		document.body.append(viewer);
		await vi.waitFor(() =>
			expect(
				viewer.querySelector('[data-role="toggle-source"]'),
			).not.toBeNull(),
		);

		const sourceButton = viewer.querySelector<HTMLElement>(
			'[data-role="toggle-source"]',
		);
		const toolbarButton = viewer.querySelector<HTMLElement>(
			'[data-role="toggle-editor-toolbar"]',
		);
		const editorActions = viewer.querySelector<HTMLElement>(
			'[data-role="editor-actions"]',
		);
		expect(editorActions?.hidden).toBe(true);
		expect(
			Array.from(editorActions?.children ?? []).map((child) =>
				child.getAttribute("data-role"),
			),
		).toEqual(["toggle-editor-toolbar", "reset", "run"]);
		sourceButton?.click();
		await vi.waitFor(() =>
			expect(viewer.querySelector("tp-code-editor")).not.toBeNull(),
		);
		const editor = viewer.querySelector<HTMLElement>("tp-code-editor");
		expect(editorActions?.hidden).toBe(false);
		expect(toolbarButton?.hidden).toBe(false);
		toolbarButton?.click();
		expect(editor?.hasAttribute("toolbar")).toBe(true);
		sourceButton?.click();
		expect(editorActions?.hidden).toBe(true);
	});

	it("accepts the canonical tp/html inline script type", () => {
		const viewer = document.createElement("tp-html-viewer");
		viewer.innerHTML =
			'<script type="tp/html"><p>Canonical HTML source</p></script>';
		const example = (
			viewer as unknown as {
				readInlineSource(): { source: string };
			}
		).readInlineSource();
		expect(example.source).toContain("<p>Canonical HTML source</p>");
	});

	it("covers shared source loading, controls, failures and cleanup", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn(async (url: string) => ({
				ok: !url.includes("missing"),
				status: 404,
				text: async () => `loaded:${url}`,
			})),
		);
		const viewer = document.createElement(
			"test-markup-viewer",
		) as TestMarkupViewer;
		viewer.src = " examples/one.txt, /two.txt ";
		document.body.append(viewer);
		await vi.waitFor(() => expect(viewer.textContent).toContain("loaded:"));

		const select = viewer.querySelector("select");
		expect(select?.options).toHaveLength(2);
		if (select !== null) {
			select.value = "missing";
			select.dispatchEvent(new Event("change"));
			select.value = select.options[1]?.value ?? "";
			select.dispatchEvent(new Event("change"));
		}
		viewer.querySelector<HTMLElement>('[data-mode="tree"]')?.click();
		viewer
			.querySelector<HTMLElement>('[data-role="toggle-editor-toolbar"]')
			?.click();
		const sourceButton = viewer.querySelector<HTMLElement>(
			'[data-role="toggle-source"]',
		);
		const outputButton = viewer.querySelector<HTMLElement>(
			'[data-role="toggle-output"]',
		);
		outputButton?.click();
		sourceButton?.click();
		sourceButton?.click();
		viewer.querySelector<HTMLElement>('[data-role="run"]')?.click();
		viewer.querySelector<HTMLElement>('[data-role="reset"]')?.click();

		viewer.src = "";
		expect(viewer.src).toBe("");
		viewer.src = "missing.txt";
		await vi.waitFor(() =>
			expect(
				viewer.querySelector(".tp-markup-viewer-error")?.textContent,
			).toContain("404"),
		);
		viewer.remove();
		expect(viewer.disposed).toBe(true);
	});

	it("executes explicitly allowed scripts and handles iframe-free output", () => {
		const viewer = document.createElement(
			"test-markup-viewer",
		) as TestMarkupViewer;
		const api = viewer as unknown as {
			activateOutputScripts(container: HTMLElement): void;
			initializeOutputIframe(container: HTMLElement): void;
			readMode(value: string, fallback: "render"): "render" | "tree";
		};
		const container = document.createElement("div");
		container.innerHTML =
			'<script type="application/json" data-id="one">{"ok":true}</script>';
		api.activateOutputScripts(container);
		viewer.setAttribute("allow-script", "");
		const original = container.querySelector("script");
		api.activateOutputScripts(container);
		expect(container.querySelector("script")).not.toBe(original);
		api.initializeOutputIframe(container);
		expect(api.readMode("tree", "render")).toBe("tree");
		expect(api.readMode("unknown", "render")).toBe("render");
	});

	it("initializes and measures an iframe output document", () => {
		const viewer = document.createElement(
			"test-markup-viewer",
		) as TestMarkupViewer;
		document.body.append(viewer);
		const container = document.createElement("div");
		const iframe = document.createElement("iframe");
		iframe.srcdoc = "<p>Preview</p><tp-sample></tp-sample>";
		const rect = iframe.getBoundingClientRect();
		vi.spyOn(iframe, "getClientRects").mockReturnValue({
			0: rect,
			length: 1,
			item: (index: number) => (index === 0 ? rect : null),
			[Symbol.iterator]: () => [rect][Symbol.iterator](),
		});
		container.append(iframe);
		document.body.append(container);
		const body = iframe.contentDocument?.body;
		if (body !== undefined && body !== null) {
			body.innerHTML = "<p>Preview</p><tp-sample></tp-sample>";
			vi.spyOn(body, "getBoundingClientRect").mockReturnValue({
				top: 0,
				bottom: 20,
				height: 20,
			} as DOMRect);
			for (const child of Array.from(body.children)) {
				child.setAttribute("style", "margin-block: 10px 4px");
				vi.spyOn(child, "getBoundingClientRect").mockReturnValue({
					top: 2,
					bottom: 58,
					height: 56,
				} as DOMRect);
			}
			const overflowingControl = document.createElement("button");
			body.firstElementChild?.append(overflowingControl);
			vi.spyOn(overflowingControl, "getBoundingClientRect").mockReturnValue({
				top: 60,
				bottom: 88,
				height: 28,
			} as DOMRect);
		}
		const api = viewer as unknown as {
			initializeOutputIframe(container: HTMLElement): void;
			scheduleIframeHeightSync(iframe: HTMLIFrameElement): void;
		};
		api.initializeOutputIframe(container);
		iframe.dispatchEvent(new Event("load"));
		expect(iframe.style.height).toBe("88px");
		iframe.setAttribute("popover", "manual");
		iframe.dispatchEvent(new Event("load"));
	});

	it("tracks closed disclosures, asynchronous growth, shrinking and content replacement", async () => {
		vi.unstubAllGlobals();
		const viewer = document.createElement(
			"test-markup-viewer",
		) as TestMarkupViewer;
		document.body.append(viewer);
		await vi.waitFor(() =>
			expect(viewer.textContent).toContain("render:inline"),
		);
		const container = document.createElement("div");
		const iframe = document.createElement("iframe");
		container.append(iframe);
		document.body.append(container);
		const body = iframe.contentDocument?.body;
		if (!body) throw new Error("Missing iframe body");
		body.innerHTML =
			"<details><summary><span>Question</span></summary><div>Answer</div><summary>Hidden second summary</summary></details>";
		const details = body.querySelector("details");
		const summary = body.querySelector("summary");
		const content = body.querySelector("div");
		const extraSummary = body.querySelector("summary + div + summary");
		if (!details || !summary || !content || !extraSummary)
			throw new Error("Missing disclosure");
		let bottom = 300;
		vi.spyOn(details, "getBoundingClientRect").mockImplementation(
			() =>
				({
					top: 0,
					bottom: details.open ? bottom : 40,
					height: details.open ? bottom : 40,
				}) as DOMRect,
		);
		vi.spyOn(summary, "getBoundingClientRect").mockReturnValue({
			top: 0,
			bottom: 40,
			height: 40,
		} as DOMRect);
		vi.spyOn(content, "getBoundingClientRect").mockImplementation(
			() => ({ top: 40, bottom, height: bottom - 40 }) as DOMRect,
		);
		vi.spyOn(extraSummary, "getBoundingClientRect").mockReturnValue({
			top: 40,
			bottom: 100,
			height: 60,
		} as DOMRect);
		const api = viewer as unknown as {
			initializeOutputIframe(container: HTMLElement): void;
		};
		api.initializeOutputIframe(container);
		expect(iframe.style.height).toBe("40px");
		details.open = true;
		await vi.waitFor(() => expect(iframe.style.height).toBe("300px"));
		bottom = 500;
		content.textContent = "Asynchronous content";
		await vi.waitFor(() => expect(iframe.style.height).toBe("500px"));
		bottom = 150;
		content.textContent = "Shorter content";
		await vi.waitFor(() => expect(iframe.style.height).toBe("150px"));
		details.open = false;
		await vi.waitFor(() => expect(iframe.style.height).toBe("40px"));
		const replacement = iframe.contentDocument?.createElement("div");
		if (!replacement) throw new Error("Missing replacement");
		vi.spyOn(replacement, "getBoundingClientRect").mockReturnValue({
			top: 0,
			bottom: 25,
			height: 25,
		} as DOMRect);
		body.replaceChildren(replacement);
		await vi.waitFor(() => expect(iframe.style.height).toBe("25px"));
	});

	it.each(["hidden", "clip", "auto", "scroll"])(
		"does not count transformed content clipped by overflow-y: %s",
		(overflow) => {
			const viewer = document.createElement(
				"test-markup-viewer",
			) as TestMarkupViewer;
			const container = document.createElement("div");
			const iframe = document.createElement("iframe");
			container.append(iframe);
			document.body.append(viewer, container);
			const body = iframe.contentDocument?.body;
			if (!body) throw new Error("Missing iframe document");
			body.style.padding = "0";
			body.innerHTML = `<div style="overflow-y: ${overflow}"><div style="position: absolute"><svg><path></path></svg></div></div><p>After the map</p>`;
			const viewport = body.firstElementChild;
			const path = body.querySelector("path");
			const paragraph = body.querySelector("p");
			if (!viewport || !path || !paragraph)
				throw new Error("Missing test content");
			paragraph.style.margin = "0";
			vi.spyOn(viewport, "getBoundingClientRect").mockReturnValue({
				top: 10,
				bottom: 210,
				height: 200,
			} as DOMRect);
			const geometry = vi
				.spyOn(path, "getBoundingClientRect")
				.mockReturnValue({ top: 150, bottom: 900, height: 750 } as DOMRect);
			vi.spyOn(paragraph, "getBoundingClientRect").mockReturnValue({
				top: 220,
				bottom: 250,
				height: 30,
			} as DOMRect);
			const api = viewer as unknown as {
				initializeOutputIframe(container: HTMLElement): void;
			};
			api.initializeOutputIframe(container);
			iframe.dispatchEvent(new Event("load"));
			expect(iframe.style.height).toBe("250px");
			geometry.mockReturnValue({
				top: 950,
				bottom: 1800,
				height: 850,
			} as DOMRect);
			iframe.dispatchEvent(new Event("load"));
			expect(iframe.style.height).toBe("250px");
			geometry.mockReturnValue({
				top: -500,
				bottom: -10,
				height: 490,
			} as DOMRect);
			iframe.dispatchEvent(new Event("load"));
			expect(iframe.style.height).toBe("250px");
			// Visible content changes still resize the iframe in both directions.
			vi.spyOn(paragraph, "getBoundingClientRect").mockReturnValue({
				top: 220,
				bottom: 320,
				height: 100,
			} as DOMRect);
			iframe.dispatchEvent(new Event("load"));
			expect(iframe.style.height).toBe("320px");
			paragraph.remove();
			iframe.dispatchEvent(new Event("load"));
			expect(iframe.style.height).toBe("210px");
		},
	);

	it.each(["fixed", "absolute"])(
		"excludes descendants of %s overlays from the iframe height",
		(position) => {
			const viewer = document.createElement(
				"test-markup-viewer",
			) as TestMarkupViewer;
			const container = document.createElement("div");
			const iframe = document.createElement("iframe");
			container.append(iframe);
			document.body.append(viewer, container);
			const body = iframe.contentDocument?.body;
			if (!body) throw new Error("Missing iframe document");
			body.style.padding = "0";
			body.innerHTML = `<p style="margin: 0">Visible content</p><aside style="position: ${position}"><div><span>Drawer content</span></div></aside>`;
			const paragraph = body.querySelector("p");
			const overlayChild = body.querySelector("span");
			if (!paragraph || !overlayChild) throw new Error("Missing test content");
			const contentBounds = vi
				.spyOn(paragraph, "getBoundingClientRect")
				.mockReturnValue({ top: 0, bottom: 200, height: 200 } as DOMRect);
			vi.spyOn(overlayChild, "getBoundingClientRect").mockImplementation(
				() =>
					({
						top: 64,
						bottom: Number.parseFloat(iframe.style.height || "40000"),
						height: 40000,
					}) as DOMRect,
			);
			const api = viewer as unknown as {
				initializeOutputIframe(container: HTMLElement): void;
			};
			api.initializeOutputIframe(container);
			iframe.dispatchEvent(new Event("load"));
			expect(iframe.style.height).toBe("200px");
			contentBounds.mockReturnValue({
				top: 0,
				bottom: 500,
				height: 500,
			} as DOMRect);
			iframe.dispatchEvent(new Event("load"));
			expect(iframe.style.height).toBe("500px");
			contentBounds.mockReturnValue({
				top: 0,
				bottom: 100,
				height: 100,
			} as DOMRect);
			iframe.dispatchEvent(new Event("load"));
			expect(iframe.style.height).toBe("100px");
		},
	);

	it("defers hidden iframes and reacts to document observers", () => {
		const mutationCallbacks: MutationCallback[] = [];
		const resizeCallbacks: ResizeObserverCallback[] = [];
		class MutationObserverMock {
			public constructor(callback: MutationCallback) {
				mutationCallbacks.push(callback);
			}
			public observe() {}
			public disconnect() {}
			public takeRecords(): MutationRecord[] {
				return [];
			}
		}
		class ResizeObserverMock {
			public constructor(callback: ResizeObserverCallback) {
				resizeCallbacks.push(callback);
			}
			public observe() {}
			public disconnect() {}
			public unobserve() {}
		}
		let frameCallback: FrameRequestCallback | undefined;
		vi.stubGlobal("MutationObserver", MutationObserverMock);
		vi.stubGlobal("ResizeObserver", ResizeObserverMock);
		vi.stubGlobal(
			"requestAnimationFrame",
			vi.fn((callback: FrameRequestCallback) => {
				frameCallback = callback;
				return 7;
			}),
		);

		const viewer = document.createElement(
			"test-markup-viewer",
		) as TestMarkupViewer;
		document.body.append(viewer);
		const hidden = document.createElement("div");
		hidden.hidden = true;
		const container = document.createElement("div");
		const iframe = document.createElement("iframe");
		iframe.srcdoc = "<tp-sample></tp-sample>";
		container.append(iframe);
		hidden.append(container);
		document.body.append(hidden);
		const api = viewer as unknown as {
			initializeOutputIframe(container: HTMLElement): void;
			scheduleIframeHeightSync(iframe: HTMLIFrameElement): void;
		};
		api.initializeOutputIframe(container);
		iframe.dispatchEvent(new Event("load"));
		expect(iframe.hasAttribute("srcdoc")).toBe(false);
		mutationCallbacks.at(-1)?.([], {} as MutationObserver);
		hidden.hidden = false;
		mutationCallbacks.at(-1)?.([], {} as MutationObserver);
		expect(iframe.srcdoc).toContain("tp-sample");
		iframe.dispatchEvent(new Event("load"));

		const added =
			iframe.contentDocument?.createElement("tp-added") ??
			document.createElement("tp-added");
		mutationCallbacks.at(-1)?.(
			[
				{
					addedNodes: [document.createTextNode("text"), added],
				} as unknown as MutationRecord,
			],
			{} as MutationObserver,
		);
		resizeCallbacks.at(-1)?.([], {} as ResizeObserver);
		resizeCallbacks.at(-1)?.([], {} as ResizeObserver);
		iframe.setAttribute("popover", "manual");
		frameCallback?.(0);
		api.scheduleIframeHeightSync(iframe);
		iframe.remove();
		frameCallback?.(0);
		viewer.remove();
	});

	it("covers shared defaults, setters and defensive rendering paths", async () => {
		const viewer = document.createElement(
			"test-markup-viewer",
		) as TestMarkupViewer;
		viewer.lite = true;
		expect(viewer.lite).toBe(true);
		viewer.lite = false;
		viewer.src = "one.txt";
		expect(viewer.src).toBe("one.txt");
		viewer.src = " ";
		const example = {
			label: "One",
			source: "source",
			context: new URL(document.baseURI),
		};
		expect(viewer.extract(example)).toEqual([example]);
		expect(viewer.resetSource(example)).toBe("source");
		viewer.requestRender();

		vi.stubGlobal(
			"fetch",
			vi.fn(async () => ({ ok: true, text: async () => "root" })),
		);
		viewer.src = "/";
		expect((await viewer.load())[0]?.label).toBe("Example");
		viewer.src = "";

		(viewer as unknown as { outputModes: unknown[] }).outputModes = [];
		document.body.append(viewer);
		await vi.waitFor(() =>
			expect(viewer.textContent).toContain("at least one output mode"),
		);

		(viewer as unknown as { outputModes: unknown[] }).outputModes = [
			{ value: "render", label: "Render" },
		];
		viewer.remove();
		viewer.textContent = "throw";
		document.body.append(viewer);
		await vi.waitFor(() =>
			expect(viewer.textContent).toContain("render failed"),
		);
	});

	it("restores an iframe through IntersectionObserver visibility", () => {
		let intersectionCallback: IntersectionObserverCallback | undefined;
		class IntersectionObserverMock {
			public constructor(callback: IntersectionObserverCallback) {
				intersectionCallback = callback;
			}
			public observe() {}
			public disconnect() {}
			public unobserve() {}
			public takeRecords(): IntersectionObserverEntry[] {
				return [];
			}
			public root = null;
			public rootMargin = "";
			public thresholds = [];
		}
		vi.stubGlobal("IntersectionObserver", IntersectionObserverMock);
		const viewer = document.createElement(
			"test-markup-viewer",
		) as TestMarkupViewer;
		const container = document.createElement("div");
		const iframe = document.createElement("iframe");
		iframe.srcdoc = "<p>Deferred</p>";
		container.append(iframe);
		document.body.append(viewer, container);
		(
			viewer as unknown as {
				initializeOutputIframe(container: HTMLElement): void;
			}
		).initializeOutputIframe(container);
		expect(iframe.hasAttribute("srcdoc")).toBe(false);
		intersectionCallback?.(
			[{ isIntersecting: false }] as IntersectionObserverEntry[],
			{} as IntersectionObserver,
		);
		expect(iframe.hasAttribute("srcdoc")).toBe(false);
		intersectionCallback?.(
			[{ isIntersecting: true }] as IntersectionObserverEntry[],
			{} as IntersectionObserver,
		);
		expect(iframe.srcdoc).toContain("Deferred");
	});
});
