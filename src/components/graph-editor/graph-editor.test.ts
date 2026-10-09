import { afterEach, describe, expect, it, vi } from "vitest";
import { required } from "../../test-helpers/required.js";
import type { TpCodeEditor } from "../code-editor/code-editor.js";
import {
	renderMarkdownInto,
	renderMarkdownToHtml,
} from "../markdown/markdown.js";
import { type TpGraphDocument, TpGraphEditor } from "./graph-editor.js";
import {
	formatGraphSchemaError,
	TpGraphDocumentSchema,
} from "./graph-schema.js";

afterEach(() => {
	document.body.replaceChildren();
	vi.restoreAllMocks();
});

describe("<tp-graph-editor>", () => {
	it("toggles the JSON code editor toolbar", async () => {
		const graph = new TpGraphEditor();
		document.body.append(graph);
		await new Promise<void>((resolve) =>
			window.requestAnimationFrame(() => resolve()),
		);
		graph.querySelector<HTMLElement>('[data-action="toggle-json"]')?.click();
		const button = graph.querySelector<HTMLElement>(
			'[data-action="editor-toolbar"]',
		);
		const codeEditor = graph.querySelector<HTMLElement>("tp-code-editor");
		expect(button?.getAttribute("name")).toBe("keyboard-f1");
		button?.click();
		expect(codeEditor?.hasAttribute("toolbar")).toBe(true);
	});
	it("moves selected nodes with the arrow keys", async () => {
		const editor = new TpGraphEditor();
		editor.value = {
			version: 1,
			nodes: [{ id: "movable", type: "node", x: 40, y: 60 }],
			edges: [],
		};
		document.body.append(editor);
		await new Promise<void>((resolve) =>
			window.requestAnimationFrame(() => resolve()),
		);
		editor.querySelector<SVGElement>('[data-node-id="movable"]')?.dispatchEvent(
			new PointerEvent("pointerdown", {
				bubbles: true,
				clientX: 40,
				clientY: 60,
			}),
		);
		expect(document.activeElement?.classList).toContain("tp-graph-canvas");
		editor
			.querySelector(".tp-graph-canvas")
			?.dispatchEvent(
				new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }),
			);
		editor.querySelector(".tp-graph-canvas")?.dispatchEvent(
			new KeyboardEvent("keydown", {
				key: "ArrowDown",
				shiftKey: true,
				bubbles: true,
			}),
		);
		expect(editor.value.nodes[0]).toMatchObject({ x: 41, y: 70 });
	});
	it("loads and validates an initial graph from src", async () => {
		const fetchMock = vi.fn().mockResolvedValue(
			new Response(
				JSON.stringify({
					version: 1,
					title: "Remote graph",
					nodes: [{ id: "remote", type: "node", x: 40, y: 60 }],
					edges: [],
				}),
				{ status: 200 },
			),
		);
		const originalFetch = globalThis.fetch;
		globalThis.fetch = fetchMock;
		try {
			const editor = new TpGraphEditor();
			editor.src = "/graphs/example.json";
			document.body.append(editor);
			await new Promise<void>((resolve) => window.setTimeout(resolve, 0));
			expect(fetchMock).toHaveBeenCalledWith("/graphs/example.json");
			expect(editor.value.title).toBe("Remote graph");
			expect(editor.value.nodes[0]?.id).toBe("remote");
			const prompt = vi.spyOn(window, "prompt").mockReturnValue(null);
			editor.querySelector<HTMLElement>('[data-action="export"]')?.click();
			await Promise.resolve();
			expect(prompt).toHaveBeenCalledWith("Save as", "example.json");
			prompt.mockRestore();
		} finally {
			globalThis.fetch = originalFetch;
		}
	});

	it("rejects a src document that does not match the tp/graph schema", async () => {
		const fetchMock = vi
			.fn()
			.mockResolvedValue(
				new Response(
					JSON.stringify({ version: 1, nodes: [], edges: "invalid" }),
					{ status: 200 },
				),
			);
		const originalFetch = globalThis.fetch;
		globalThis.fetch = fetchMock;
		try {
			const editor = new TpGraphEditor();
			editor.src = "/graphs/invalid.json";
			const errorEvent = new Promise<CustomEvent>((resolve) => {
				editor.addEventListener(
					"tp-graph-error",
					(event) => resolve(event as CustomEvent),
					{ once: true },
				);
			});
			document.body.append(editor);
			const event = await errorEvent;
			expect(event.detail.operation).toBe("load-src");
			expect(event.detail.error).toBeInstanceOf(TypeError);
			expect(editor.value).toMatchObject({ nodes: [], edges: [] });
		} finally {
			globalThis.fetch = originalFetch;
		}
	});

	it("creates nodes and edges through its public model API", () => {
		const editor = new TpGraphEditor();
		document.body.append(editor);
		const first = editor.addNode("node", { x: 20, y: 30 }, "A");
		const second = editor.addNode("state", { x: 140, y: 30 }, "B");
		editor.addEdge(first.id, second.id);
		expect(editor.value.nodes).toHaveLength(2);
		expect(editor.value.edges[0]).toMatchObject({
			source: first.id,
			target: second.id,
		});
		expect(editor.querySelectorAll("[data-node-id]")).toHaveLength(2);
	});

	it("attaches, labels, moves, and renders a measurement point on an edge", () => {
		const editor = new TpGraphEditor();
		document.body.append(editor);
		const first = editor.addNode("node", { x: 20, y: 30 }, "A");
		const second = editor.addNode("node", { x: 220, y: 30 }, "B");
		const edge = editor.addEdge(first.id, second.id);
		const measurement = editor.addMeasurement(edge.id, 0.25);
		editor.setElementLabel(measurement.id, "X");
		editor.moveMeasurement(measurement.id, 0.75);
		expect(editor.value.edges[0]?.data?.measurements).toEqual([
			{ id: measurement.id, position: 0.75, label: "X" },
		]);
		expect(
			editor.querySelector(`[data-measurement-id="${measurement.id}"]`)
				?.textContent,
		).toContain("X");
	});

	it("provides a four-port hub in the General palette", async () => {
		const editor = new TpGraphEditor();
		document.body.append(editor);
		await new Promise<void>((resolve) =>
			window.requestAnimationFrame(() => resolve()),
		);
		expect(editor.querySelector('[data-shape="hub"]')).not.toBeNull();
		const hub = editor.addNode("hub", { x: 100, y: 100 });
		expect(
			editor.querySelectorAll(`[data-node-id="${hub.id}"] .tp-graph-port`),
		).toHaveLength(4);
		expect(
			editor.querySelector(`[data-node-id="${hub.id}"] .tp-graph-hub`),
		).not.toBeNull();
		expect(() => editor.addEdge(hub.id, hub.id)).toThrow(
			"Self-links are not allowed on hubs.",
		);
	});

	it("always renders a lower toolbar message area and a draggable minimap viewport", async () => {
		const editor = new TpGraphEditor();
		editor.value = {
			version: 1,
			nodes: [{ id: "far", type: "node", x: 1400, y: 700 }],
			edges: [],
		};
		editor.message = "Ready";
		document.body.append(editor);
		await new Promise<void>((resolve) =>
			window.requestAnimationFrame(() => resolve()),
		);
		expect(editor.querySelector(".tp-graph-specific-toolbar")).not.toBeNull();
		expect(editor.querySelector(".tp-graph-toolbar-message")?.textContent).toBe(
			"Ready",
		);
		const minimap = editor.querySelector<SVGSVGElement>(
			".tp-graph-minimap svg",
		);
		const viewport = editor.querySelector<SVGRectElement>(
			"[data-minimap-viewport]",
		);
		expect(minimap).not.toBeNull();
		expect(viewport).not.toBeNull();
		if (!minimap || !viewport) return;
		vi.spyOn(minimap, "getBoundingClientRect").mockReturnValue({
			x: 0,
			y: 0,
			left: 0,
			top: 0,
			right: 160,
			bottom: 100,
			width: 160,
			height: 100,
			toJSON: () => ({}),
		});
		viewport.dispatchEvent(
			new MouseEvent("pointerdown", {
				bubbles: true,
				cancelable: true,
				clientX: 20,
				clientY: 20,
			}),
		);
		editor.dispatchEvent(
			new MouseEvent("pointermove", {
				bubbles: true,
				clientX: 60,
				clientY: 40,
			}),
		);
		expect(
			editor.querySelector(".tp-graph-scene")?.getAttribute("transform"),
		).not.toContain("translate(0 0)");
		editor.dispatchEvent(new MouseEvent("pointerup", { bubbles: true }));
	});

	it("scrolls the canvas and keeps the minimap viewport synchronized", async () => {
		const editor = new TpGraphEditor();
		editor.value = {
			version: 1,
			nodes: [{ id: "far", type: "node", x: 1400, y: 900 }],
			edges: [],
		};
		document.body.append(editor);
		await new Promise<void>((resolve) =>
			window.requestAnimationFrame(() => resolve()),
		);
		const frame = editor.querySelector(".tp-graph-canvas-frame");
		frame?.dispatchEvent(
			new WheelEvent("wheel", {
				bubbles: true,
				cancelable: true,
				deltaX: 90,
				deltaY: 120,
			}),
		);
		const sceneTransform =
			editor.querySelector(".tp-graph-scene")?.getAttribute("transform") ?? "";
		const viewport = editor.querySelector<SVGRectElement>(
			"[data-minimap-viewport]",
		);
		expect(sceneTransform).toContain("translate(-90 -120)");
		expect(viewport?.getAttribute("x")).toBe("90");
		expect(viewport?.getAttribute("y")).toBe("120");
	});

	it("shows the JSON editor and synchronizes graph changes on demand", async () => {
		const editor = new TpGraphEditor();
		document.body.append(editor);
		await new Promise<void>((resolve) =>
			window.requestAnimationFrame(() => resolve()),
		);
		const codeEditor = editor.querySelector<TpCodeEditor>("tp-code-editor");
		expect(codeEditor).not.toBeNull();
		const codeSection = editor.querySelector<HTMLElement>(".tp-graph-code");
		expect(codeSection?.hidden).toBe(true);
		editor.addNode("node", { x: 20, y: 30 }, "Before opening");
		editor.querySelector<HTMLElement>('[data-action="toggle-json"]')?.click();
		expect(codeSection?.hidden).toBe(false);
		const sourceOnOpen =
			typeof codeEditor?.getValue === "function"
				? codeEditor.getValue()
				: codeEditor?.getAttribute("value");
		expect(sourceOnOpen).toContain('"label": "Before opening"');
		editor.addNode("node", { x: 40, y: 50 }, "From canvas");
		const sourceBeforeSync =
			typeof codeEditor?.getValue === "function"
				? codeEditor.getValue()
				: codeEditor?.getAttribute("value");
		expect(sourceBeforeSync).not.toContain('"label": "From canvas"');
		editor.querySelector<HTMLElement>('[data-action="sync-json"]')?.click();
		const sourceAfterSync =
			typeof codeEditor?.getValue === "function"
				? codeEditor.getValue()
				: codeEditor?.getAttribute("value");
		expect(sourceAfterSync).toContain('"label": "From canvas"');
	});

	it("updates the graph from valid JSON entered in the code editor", async () => {
		const editor = new TpGraphEditor();
		document.body.append(editor);
		await new Promise<void>((resolve) =>
			window.requestAnimationFrame(() => resolve()),
		);
		const codeEditor = editor.querySelector<TpCodeEditor>("tp-code-editor");
		const source = JSON.stringify({
			version: 1,
			title: "Edited as JSON",
			nodes: [{ id: "json-node", type: "node", x: 70, y: 80 }],
			edges: [],
		});
		codeEditor?.dispatchEvent(
			new CustomEvent("tp-code-editor-input", {
				bubbles: true,
				detail: { filename: "", value: source },
			}),
		);
		expect(editor.value.title).toBe("");
		editor.querySelector<HTMLElement>('[data-action="sync-json"]')?.click();
		expect(editor.value.title).toBe("Edited as JSON");
		expect(editor.querySelector('[data-node-id="json-node"]')).not.toBeNull();
		expect(editor.querySelector("tp-code-editor")).toBe(codeEditor);
	});

	it("keeps the current graph when the edited JSON is invalid", async () => {
		const editor = new TpGraphEditor();
		editor.value = {
			version: 1,
			nodes: [{ id: "kept", type: "node", x: 1, y: 2 }],
			edges: [],
		};
		document.body.append(editor);
		await new Promise<void>((resolve) =>
			window.requestAnimationFrame(() => resolve()),
		);
		const codeEditor = editor.querySelector<TpCodeEditor>("tp-code-editor");
		codeEditor?.dispatchEvent(
			new CustomEvent("tp-code-editor-input", {
				bubbles: true,
				detail: { filename: "", value: "{" },
			}),
		);
		expect(editor.value.nodes[0]?.id).toBe("kept");
		expect(codeEditor?.hasAttribute("data-invalid")).toBe(false);
		editor.querySelector<HTMLElement>('[data-action="sync-json"]')?.click();
		expect(codeEditor?.hasAttribute("data-invalid")).toBe(true);
		expect(editor.querySelector(".tp-graph-code-status")?.textContent).not.toBe(
			"",
		);
	});

	it("validates imported graph documents with Zod", () => {
		const editor = new TpGraphEditor();
		expect(() =>
			editor.importJson(
				JSON.stringify({
					version: 1,
					nodes: [{ id: "broken", type: "node", x: "not-a-number", y: 20 }],
					edges: [],
				}),
			),
		).toThrow(/nodes\.0\.x/);
		expect(() =>
			editor.importJson(
				JSON.stringify({
					version: 1,
					nodes: [{ id: "a", type: "node", x: 10, y: 20 }],
					edges: [{ id: "edge", source: "a", target: "missing" }],
				}),
			),
		).toThrow(/edges\.0\.target: Unknown node/);
	});

	it("defensively copies assigned and returned graphs", () => {
		const graph: TpGraphDocument = {
			version: 1,
			nodes: [{ id: "a", type: "node", x: 1, y: 2 }],
			edges: [],
		};
		const editor = new TpGraphEditor();
		editor.value = graph;
		required(graph.nodes[0]).x = 99;
		const result = editor.value;
		required(result.nodes[0]).x = 100;
		expect(required(editor.value.nodes[0]).x).toBe(1);
	});

	it("always exposes the graph title in JSON, including when it is empty", () => {
		const editor = new TpGraphEditor();
		expect(editor.value.title).toBe("");
		expect(JSON.parse(editor.exportJson())).toMatchObject({
			version: 1,
			title: "",
		});
		editor.value = { version: 1, nodes: [], edges: [] };
		expect(editor.value.title).toBe("");
		expect(editor.exportJson()).toContain('"title": ""');
	});

	it("runs a registered simulator and emits a step event", async () => {
		const editor = new TpGraphEditor();
		editor.value = {
			version: 1,
			nodes: [{ id: "a", type: "node", x: 1, y: 2 }],
			edges: [],
		};
		document.body.append(editor);
		const listener = vi.fn();
		editor.addEventListener("tp-graph-simulation-step", listener);
		editor.registerSimulator("move", () => ({
			nodes: { a: { x: 42 } },
			duration: 0,
		}));
		await editor.step("move");
		expect(required(editor.value.nodes[0]).x).toBe(42);
		expect(listener).toHaveBeenCalledOnce();
	});

	it("rejects edges with missing endpoints", () => {
		const editor = new TpGraphEditor();
		expect(() => editor.addEdge("missing", "also-missing")).toThrow(TypeError);
	});

	it("reads its initial JSON document from a direct tp/graph script", async () => {
		const editor = document.createElement("tp-graph-editor") as TpGraphEditor;
		editor.innerHTML = `<script type="tp/graph">
      {
        "version": 1,
        "nodes": [{ "id": "source", "type": "node", "x": 40, "y": 60 }],
        "edges": []
      }
    </script>`;
		document.body.append(editor);
		await new Promise<void>((resolve) =>
			window.requestAnimationFrame(() => resolve()),
		);
		expect(editor.value.nodes).toEqual([
			expect.objectContaining({ id: "source", x: 40, y: 60 }),
		]);
		expect(editor.querySelector("script")).toBeNull();
	});

	it("does not interpret generic application/json scripts as graph sources", async () => {
		const editor = document.createElement("tp-graph-editor") as TpGraphEditor;
		editor.innerHTML = `<script type="application/json">
      { "version": 1, "nodes": [{ "id": "ignored", "type": "node", "x": 0, "y": 0 }], "edges": [] }
    </script>`;
		document.body.append(editor);
		await new Promise<void>((resolve) =>
			window.requestAnimationFrame(() => resolve()),
		);
		expect(editor.value.nodes).toEqual([]);
	});

	it("keeps and loads a tp/graph source rendered through Markdown documentation", async () => {
		const markdown = `<tp-graph-editor grid>
  <script type="tp/graph">
    { "version": 1, "nodes": [{ "id": "doc", "type": "node", "x": 120, "y": 100 }], "edges": [] }
  </script>
</tp-graph-editor>`;
		const html = await renderMarkdownToHtml(markdown);
		expect(html).toContain('script type="tp/graph"');
		const root = document.createElement("div");
		document.body.append(root);
		await renderMarkdownInto(markdown, root);
		await new Promise<void>((resolve) =>
			window.requestAnimationFrame(() => resolve()),
		);
		const editor = root.querySelector<TpGraphEditor>("tp-graph-editor");
		expect(editor?.value.nodes).toHaveLength(1);
		expect(editor?.querySelectorAll("[data-node-id]")).toHaveLength(1);
	});

	it("keeps a node in place when selection redraws the canvas before dragging", async () => {
		const editor = new TpGraphEditor();
		document.body.append(editor);
		await new Promise<void>((resolve) =>
			window.requestAnimationFrame(() => resolve()),
		);
		editor.zoom = 2;
		const node = editor.addNode("node", { x: 50, y: 50 }, "Stable");
		const rect = {
			x: 200,
			y: 100,
			left: 200,
			top: 100,
			right: 800,
			bottom: 500,
			width: 600,
			height: 400,
			toJSON: () => ({}),
		} as DOMRect;
		const detachedRect = {
			x: 0,
			y: 0,
			left: 0,
			top: 0,
			right: 0,
			bottom: 0,
			width: 0,
			height: 0,
			toJSON: () => ({}),
		} as DOMRect;
		const rectSpy = vi
			.spyOn(SVGSVGElement.prototype, "getBoundingClientRect")
			.mockImplementation(function getRect(this: SVGSVGElement) {
				return this.isConnected ? rect : detachedRect;
			});
		const renderedNode = editor.querySelector<SVGGElement>(
			`[data-node-id="${node.id}"]`,
		);
		renderedNode?.dispatchEvent(
			new MouseEvent("pointerdown", {
				bubbles: true,
				clientX: 300,
				clientY: 200,
			}),
		);
		editor.dispatchEvent(
			new MouseEvent("pointermove", {
				bubbles: true,
				clientX: 300,
				clientY: 200,
			}),
		);
		editor.dispatchEvent(new MouseEvent("pointerup", { bubbles: true }));
		expect(editor.value.nodes[0]).toMatchObject({ x: 50, y: 50 });
		rectSpy.mockRestore();
	});

	it("attaches horizontal edges to shape boundaries instead of node centres", async () => {
		const editor = new TpGraphEditor();
		editor.value = {
			version: 1,
			nodes: [
				{ id: "source", type: "node", x: 100, y: 80 },
				{ id: "target", type: "state", x: 300, y: 80 },
			],
			edges: [{ id: "edge", source: "source", target: "target" }],
		};
		document.body.append(editor);
		await new Promise<void>((resolve) =>
			window.requestAnimationFrame(() => resolve()),
		);
		const line = editor.querySelector<SVGPathElement>(
			'[data-edge-id="edge"] .tp-graph-edge-line',
		);
		expect(line?.getAttribute("d")).toBe("M 132 80 L 268 80");
	});

	it("renders square ports, permanent visibility and right-angle links", async () => {
		const editor = new TpGraphEditor();
		editor.portsVisible = true;
		editor.value = {
			version: 1,
			nodes: [
				{ id: "a", type: "node", x: 100, y: 100 },
				{ id: "b", type: "node", x: 300, y: 200 },
			],
			edges: [
				{
					id: "edge",
					source: "a",
					target: "b",
					routing: "orthogonal",
					bendX: 180,
				},
			],
		};
		document.body.append(editor);
		await new Promise<void>((resolve) =>
			window.requestAnimationFrame(() => resolve()),
		);
		expect(
			editor
				.querySelector('[data-node-id="a"] .tp-graph-port')
				?.tagName.toLowerCase(),
		).toBe("rect");
		expect(
			editor.querySelector(".tp-graph-port-hit-area")?.getAttribute("width"),
		).toBe("20");
		expect(
			editor
				.querySelector(".tp-graph-port-overlay-visual")
				?.getAttribute("width"),
		).toBe("8");
		expect(
			[...editor.querySelectorAll(".tp-graph-scene > g")].map((layer) =>
				layer.getAttribute("class"),
			),
		).toEqual(["tp-graph-edges", "tp-graph-nodes", "tp-graph-port-layer"]);
		expect(
			editor
				.querySelector('[data-edge-id="edge"] .tp-graph-edge-line')
				?.getAttribute("d"),
		).toContain("H 180");
		expect(
			editor
				.querySelector('[data-edge-id="edge"] [data-edge-bend]')
				?.getAttribute("x"),
		).toBe("175");
		expect(editor.querySelector("[data-edge-orthogonal]")).not.toBeNull();
		expect(
			editor
				.querySelector(".tp-graph-palette-accordion")
				?.hasAttribute("open-indexes"),
		).toBe(false);
		expect(
			editor.querySelector('[data-action="palette-expand"]'),
		).not.toBeNull();
		expect(
			editor.querySelector('[data-action="palette-collapse"]'),
		).not.toBeNull();
		expect(editor.querySelectorAll("[data-edge-orthogonal]")).toHaveLength(8);
		expect(editor.querySelectorAll(".tp-graph-link-button-group")).toHaveLength(
			2,
		);
		expect(
			[...editor.querySelectorAll<HTMLElement>("[data-edge-direction]")].map(
				(button) => button.dataset.edgeDirection,
			),
		).toEqual(["none", "both", "forward", "backward"]);
		expect(editor.querySelector(".tp-graph-link-button-group span")).toBeNull();
	});

	it("renders orthogonal links with one, two, or three corners and either departure axis", async () => {
		const editor = new TpGraphEditor();
		editor.value = {
			version: 1,
			nodes: [
				{ id: "a", type: "node", x: 100, y: 100 },
				{ id: "b", type: "node", x: 300, y: 200 },
			],
			edges: [
				{
					id: "one-v",
					source: "a",
					target: "b",
					routing: "orthogonal",
					elbows: 1,
					departure: "vertical",
					label: "one",
				},
				{
					id: "two-v",
					source: "a",
					target: "b",
					routing: "orthogonal",
					elbows: 2,
					departure: "vertical",
					bendY: 140,
					label: "two",
				},
				{
					id: "three-v",
					source: "a",
					target: "b",
					routing: "orthogonal",
					elbows: 3,
					departure: "vertical",
					bendX: 240,
					bendY: 140,
					label: "three",
				},
			],
		};
		document.body.append(editor);
		await new Promise<void>((resolve) =>
			window.requestAnimationFrame(() => resolve()),
		);
		expect(
			editor
				.querySelector('[data-edge-id="one-v"] .tp-graph-edge-line')
				?.getAttribute("d"),
		).toContain(" V ");
		expect(
			editor.querySelector('[data-edge-id="one-v"] [data-edge-bend]'),
		).toBeNull();
		expect(
			editor
				.querySelector('[data-edge-id="two-v"] .tp-graph-edge-line')
				?.getAttribute("d"),
		).toContain("V 140");
		expect(
			editor.querySelector('[data-edge-id="two-v"] [data-edge-bend-axis="y"]'),
		).not.toBeNull();
		expect(
			editor
				.querySelector('[data-edge-id="three-v"] .tp-graph-edge-line')
				?.getAttribute("d"),
		).toContain("V 140 H 240 V");
		expect(
			editor.querySelectorAll('[data-edge-id="three-v"] [data-edge-bend]'),
		).toHaveLength(2);
		expect(
			editor.querySelector('[data-edge-id="one-v"] text')?.getAttribute("y"),
		).toBe("192");
		expect(
			editor.querySelector('[data-edge-id="two-v"] text')?.getAttribute("y"),
		).toBe("132");
	});

	it("allows an unrestricted two-corner vertical link from Output to Input", async () => {
		const editor = new TpGraphEditor();
		document.body.append(editor);
		await new Promise<void>((resolve) =>
			window.requestAnimationFrame(() => resolve()),
		);
		const output = editor.addNode("node", { x: 100, y: 100 }, "Output");
		const input = editor.addNode("node", { x: 300, y: 220 }, "Input");
		editor
			.querySelector<HTMLElement>(
				'[data-edge-orthogonal][data-edge-elbows="2"][data-edge-departure="vertical"][data-edge-turns="alternating"]',
			)
			?.click();
		editor
			.querySelector(`[data-node-id="${output.id}"] [data-port="south"]`)
			?.dispatchEvent(
				new MouseEvent("pointerdown", {
					bubbles: true,
					clientX: 100,
					clientY: 132,
				}),
			);
		editor
			.querySelector(`[data-node-id="${input.id}"] [data-port="north"]`)
			?.dispatchEvent(
				new MouseEvent("pointerup", {
					bubbles: true,
					clientX: 300,
					clientY: 188,
				}),
			);
		expect(editor.value.edges[0]).toMatchObject({
			source: output.id,
			target: input.id,
			sourcePort: "south",
			targetPort: "north",
			routing: "orthogonal",
			elbows: 2,
			departure: "vertical",
		});
	});

	it("renders link directions, parallel curves and self loops", async () => {
		const editor = new TpGraphEditor();
		editor.value = {
			version: 1,
			nodes: [
				{ id: "a", type: "node", x: 100, y: 100 },
				{ id: "b", type: "node", x: 300, y: 100 },
			],
			edges: [
				{ id: "plain", source: "a", target: "b", direction: "none" },
				{ id: "forward", source: "a", target: "b", direction: "forward" },
				{ id: "backward", source: "a", target: "b", direction: "backward" },
				{ id: "both", source: "b", target: "a", direction: "both" },
				{
					id: "loop-1",
					source: "a",
					target: "a",
					sourcePort: "east",
					targetPort: "north",
					direction: "forward",
					label: "a",
				},
				{
					id: "loop-2",
					source: "a",
					target: "a",
					sourcePort: "east",
					targetPort: "north",
					direction: "both",
					label: "b",
				},
			],
		};
		document.body.append(editor);
		await new Promise<void>((resolve) =>
			window.requestAnimationFrame(() => resolve()),
		);
		const plain = editor.querySelector(
			'[data-edge-id="plain"] .tp-graph-edge-line',
		);
		const forward = editor.querySelector(
			'[data-edge-id="forward"] .tp-graph-edge-line',
		);
		const backward = editor.querySelector(
			'[data-edge-id="backward"] .tp-graph-edge-line',
		);
		const both = editor.querySelector(
			'[data-edge-id="both"] .tp-graph-edge-line',
		);
		expect(plain?.hasAttribute("marker-end")).toBe(false);
		expect(forward?.getAttribute("marker-end")).toBe("url(#tp-graph-arrow)");
		expect(backward?.getAttribute("marker-start")).toBe("url(#tp-graph-arrow)");
		expect(backward?.hasAttribute("marker-end")).toBe(false);
		expect(both?.getAttribute("marker-start")).toBe("url(#tp-graph-arrow)");
		expect(both?.getAttribute("marker-end")).toBe("url(#tp-graph-arrow)");
		expect(plain?.getAttribute("d")).toContain(" Q ");
		expect(forward?.getAttribute("d")).not.toBe(plain?.getAttribute("d"));
		const firstLoop = editor
			.querySelector('[data-edge-id="loop-1"] .tp-graph-edge-line')
			?.getAttribute("d");
		const secondLoop = editor
			.querySelector('[data-edge-id="loop-2"] .tp-graph-edge-line')
			?.getAttribute("d");
		expect(firstLoop).toMatch(/^M 132 100 A [\d.]+ [\d.]+ 0 1 0 100 68$/);
		expect(secondLoop).toMatch(/^M 132 100 A [\d.]+ [\d.]+ 0 1 0 100 68$/);
		expect(secondLoop).not.toBe(firstLoop);
		const firstRadius = Number(firstLoop?.split(" ")[4]);
		const secondRadius = Number(secondLoop?.split(" ")[4]);
		expect(secondRadius - firstRadius).toBeGreaterThanOrEqual(18);
		expect(firstLoop?.match(/ A /g)).toHaveLength(1);
		const firstLabel = editor.querySelector<SVGTextElement>(
			'[data-edge-id="loop-1"] text',
		);
		const secondLabel = editor.querySelector<SVGTextElement>(
			'[data-edge-id="loop-2"] text',
		);
		const firstLabelPoint = {
			x: Number(firstLabel?.getAttribute("x")),
			y: Number(firstLabel?.getAttribute("y")),
		};
		const secondLabelPoint = {
			x: Number(secondLabel?.getAttribute("x")),
			y: Number(secondLabel?.getAttribute("y")),
		};
		expect(firstLabelPoint.x).toBeGreaterThan(140);
		expect(firstLabelPoint.y).toBeLessThan(60);
		expect(secondLabelPoint.x).toBeGreaterThan(firstLabelPoint.x);
		expect(secondLabelPoint.y).toBeLessThan(firstLabelPoint.y);
		const sourcePort = editor.querySelector<SVGRectElement>(
			'[data-node-id="a"] [data-port="east"]',
		);
		const targetPort = editor.querySelector<SVGRectElement>(
			'[data-node-id="a"] [data-port="north"]',
		);
		expect(firstLoop).toMatch(
			new RegExp(
				`^M ${104 + Number(sourcePort?.getAttribute("x"))} ${104 + Number(sourcePort?.getAttribute("y"))}`,
			),
		);
		expect(firstLoop).toMatch(
			new RegExp(
				`${104 + Number(targetPort?.getAttribute("x"))} ${104 + Number(targetPort?.getAttribute("y"))}$`,
			),
		);
		expect(
			editor.value.edges.find((edge) => edge.id === "loop-1"),
		).toMatchObject({
			sourcePort: "east",
			targetPort: "north",
		});
	});

	it("keeps the two endpoints of a self-link on distinct ports", () => {
		const editor = new TpGraphEditor();
		editor.value = {
			version: 1,
			nodes: [{ id: "node", type: "node", x: 100, y: 100 }],
			edges: [],
		};
		const loop = editor.addEdge("node", "node", "edge", "east", "east");
		expect(loop).toMatchObject({ sourcePort: "east", targetPort: "south" });
		const graph: TpGraphDocument = {
			version: 1,
			nodes: [{ id: "node", type: "node", x: 100, y: 100 }],
			edges: [{ id: "legacy-loop", source: "node", target: "node" }],
		};
		editor.value = graph;
		expect(editor.value.edges[0]).toMatchObject({
			sourcePort: "east",
			targetPort: "north",
		});
	});

	it("balances automatic self-links across adjacent ports", () => {
		const editor = new TpGraphEditor();
		editor.value = {
			version: 1,
			nodes: [{ id: "node", type: "node", x: 100, y: 100 }],
			edges: [],
		};
		const first = editor.addEdge("node", "node");
		const second = editor.addEdge("node", "node");
		const third = editor.addEdge("node", "node");
		const fourth = editor.addEdge("node", "node");
		expect(first).toMatchObject({ sourcePort: "east", targetPort: "north" });
		expect(second).toMatchObject({ sourcePort: "south", targetPort: "west" });
		expect(third).toMatchObject({ sourcePort: "north", targetPort: "west" });
		expect(fourth).toMatchObject({ sourcePort: "east", targetPort: "south" });
	});

	it("forgets old ports when a regular link becomes a self-link", () => {
		const editor = new TpGraphEditor();
		editor.value = {
			version: 1,
			nodes: [
				{ id: "a", type: "node", x: 100, y: 100 },
				{ id: "b", type: "node", x: 300, y: 100 },
			],
			edges: [
				{
					id: "loop-1",
					source: "a",
					target: "a",
					sourcePort: "east",
					targetPort: "north",
				},
				{
					id: "loop-2",
					source: "a",
					target: "a",
					sourcePort: "south",
					targetPort: "west",
				},
				{
					id: "regular",
					source: "a",
					target: "b",
					sourcePort: "east",
					targetPort: "west",
				},
			],
		};
		const reconnected = editor.reconnectEdge("regular", "target", "a", "south");
		expect(reconnected).toMatchObject({
			source: "a",
			target: "a",
			sourcePort: "north",
			targetPort: "west",
		});
	});

	it("changes the selected link direction from the generic palette", async () => {
		const editor = new TpGraphEditor();
		editor.value = {
			version: 1,
			nodes: [
				{ id: "a", type: "node", x: 100, y: 100 },
				{ id: "b", type: "node", x: 300, y: 100 },
			],
			edges: [{ id: "edge", source: "a", target: "b", direction: "forward" }],
		};
		document.body.append(editor);
		await new Promise<void>((resolve) =>
			window.requestAnimationFrame(() => resolve()),
		);
		editor
			.querySelector('[data-edge-id="edge"] .tp-graph-edge-hit-area')
			?.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true }));
		editor.querySelector<HTMLElement>('[data-edge-direction="both"]')?.click();
		expect(editor.value.edges[0]?.direction).toBe("both");
		const path = editor.querySelector(
			'[data-edge-id="edge"] .tp-graph-edge-line',
		);
		expect(path?.getAttribute("marker-start")).toBe("url(#tp-graph-arrow)");
		expect(path?.getAttribute("marker-end")).toBe("url(#tp-graph-arrow)");
		expect(
			editor
				.querySelector('[data-edge-direction="both"]')
				?.classList.contains("is-active"),
		).toBe(true);
	});

	it("zooms the rendered scene through its API and toolbar", async () => {
		const editor = new TpGraphEditor();
		document.body.append(editor);
		await new Promise<void>((resolve) =>
			window.requestAnimationFrame(() => resolve()),
		);
		editor.zoom = 2;
		expect(
			editor.querySelector(".tp-graph-scene")?.getAttribute("transform"),
		).toBe("translate(0 0) scale(2)");
		editor
			.querySelector<HTMLButtonElement>('[data-action="zoom-out"]')
			?.click();
		expect(editor.zoom).toBeCloseTo(2 / 1.2);
		editor.resetZoom();
		expect(editor.zoom).toBe(1);
	});

	it("exports and imports a validated JSON graph", () => {
		const editor = new TpGraphEditor();
		editor.value = {
			version: 1,
			nodes: [{ id: "exported", type: "node", x: 10, y: 20 }],
			edges: [],
		};
		const source = editor.exportJson();
		const imported = new TpGraphEditor();
		const listener = vi.fn();
		imported.addEventListener("tp-graph-import", listener);
		imported.importJson(source);
		expect(imported.value.nodes[0]).toMatchObject({
			id: "exported",
			x: 10,
			y: 20,
		});
		expect(listener).toHaveBeenCalledOnce();
		expect(() => imported.importJson('{"version": 2}')).toThrow(TypeError);
	});

	it("stores a graph title, supports comments and exports SVG", async () => {
		const editor = new TpGraphEditor();
		document.body.append(editor);
		await new Promise<void>((resolve) =>
			window.requestAnimationFrame(() => resolve()),
		);
		editor.setTitle("My graph");
		const comment = editor.addNode(
			"comment",
			{ x: 200, y: 180 },
			"First line\nSecond line",
		);
		expect(editor.value.title).toBe("My graph");
		expect(comment.type).toBe("comment");
		expect(editor.querySelector(".tp-graph-title")?.textContent).toBe(
			"My graph",
		);
		expect(
			editor.querySelectorAll(`[data-node-id="${comment.id}"] tspan`),
		).toHaveLength(2);
		const svg = editor.exportSvg();
		expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');
		expect(svg).toMatch(/width="\d+"/);
		expect(svg).toMatch(/height="\d+"/);
		expect(svg).toMatch(/viewBox="0 0 \d+ \d+"/);
		expect(svg).toContain('class="tp-graph-scene" transform="translate(');
		expect(svg).toContain('<rect width="100%" height="100%"');
		expect(svg).toContain("My graph");
		expect(svg).not.toContain("tp-graph-port");
	});

	it("exports edge labels with their fill painted over the background stroke", async () => {
		const editor = new TpGraphEditor();
		editor.value = {
			version: 1,
			nodes: [
				{ id: "a", type: "node", x: 80, y: 80 },
				{ id: "b", type: "node", x: 240, y: 80 },
			],
			edges: [{ id: "edge", source: "a", target: "b", label: "Visible label" }],
		};
		document.body.append(editor);
		await new Promise<void>((resolve) =>
			window.requestAnimationFrame(() => resolve()),
		);
		const source = editor.exportSvg();
		expect(source).toContain("Visible label");
		expect(source).toContain("paint-order: stroke fill");
		expect(source).toContain("stroke-linejoin: round");
	});

	it("uses icon buttons in the generic toolbar", async () => {
		const editor = new TpGraphEditor();
		document.body.append(editor);
		await new Promise<void>((resolve) =>
			window.requestAnimationFrame(() => resolve()),
		);
		expect(editor.querySelector('[data-action="delete"]')).toBeNull();
		expect(editor.querySelector('[data-action="zoom-reset"]')).toBeNull();
		expect(
			editor.querySelector(
				`tp-save-image[anchor="#${editor.id}"][name="image-download"]`,
			),
		).not.toBeNull();
		expect(
			editor.querySelector(
				'tp-icon-button[data-action="toggle-json"][name="language-json"]',
			),
		).not.toBeNull();
		expect(
			editor.querySelector(
				'tp-icon-button[data-action="label"][name="text-short"]',
			),
		).not.toBeNull();
		const gridButton = editor.querySelector<HTMLElement>(
			'tp-icon-button[data-action="toggle-grid"][name="grid"]',
		);
		expect(gridButton).not.toBeNull();
		expect(editor.hasAttribute("grid")).toBe(false);
		gridButton?.click();
		expect(editor.hasAttribute("grid")).toBe(true);
		expect(
			editor.querySelector(
				'.tp-graph-code-header > tp-icon-button[name="sync"]',
			),
		).not.toBeNull();
		const color = editor.querySelector(
			`.tp-graph-toolbar > tp-color[anchor="#${editor.id}"]`,
		);
		const theme = editor.querySelector(".tp-graph-toolbar > tp-theme");
		expect(color).not.toBeNull();
		expect(color?.nextElementSibling).toBe(theme);
		expect(
			editor.querySelector(".tp-graph-toolbar > tp-fullscreen"),
		).not.toBeNull();
		expect(editor.querySelector(".tp-graph-specific-toolbar")).not.toBeNull();
		expect(editor.querySelector(".tp-graph-toolbar-message")).not.toBeNull();
		expect(
			[...editor.querySelectorAll(".tp-graph-toolbar tp-icon-button")].every(
				(button) => button.getAttribute("size") === "xs",
			),
		).toBe(true);
		color?.setAttribute("preset", "tp-red");
		await Promise.resolve();
		expect(editor.classList.contains("tp-red")).toBe(true);
		expect(document.body.classList.contains("tp-red")).toBe(false);
		editor.addNode("node", { x: 30, y: 30 });
		expect(
			editor
				.querySelector(".tp-graph-toolbar > tp-color")
				?.getAttribute("preset"),
		).toBe("tp-red");
	});

	it("copies, cuts, pastes, undoes and redoes the selected element", async () => {
		const editor = new TpGraphEditor();
		document.body.append(editor);
		await new Promise<void>((resolve) =>
			window.requestAnimationFrame(() => resolve()),
		);
		const node = editor.addNode("node", { x: 100, y: 120 }, "Copied node");
		editor.querySelector(`[data-node-id="${node.id}"]`)?.dispatchEvent(
			new MouseEvent("pointerdown", {
				bubbles: true,
				clientX: 100,
				clientY: 120,
			}),
		);

		expect(editor.copy()).toBe(true);
		const pastedId = editor.paste();
		const pasted = editor.value.nodes.find(
			(candidate) => candidate.id === pastedId,
		);
		expect(pasted).toMatchObject({ x: 124, y: 144, label: "Copied node" });
		expect(editor.undo()).toBe(true);
		expect(editor.value.nodes).toHaveLength(1);
		expect(editor.redo()).toBe(true);
		expect(editor.value.nodes).toHaveLength(2);
		editor.querySelector(`[data-node-id="${pastedId}"]`)?.dispatchEvent(
			new MouseEvent("pointerdown", {
				bubbles: true,
				clientX: 124,
				clientY: 144,
			}),
		);
		expect(editor.cut()).toBe(true);
		expect(editor.value.nodes).toHaveLength(1);
		expect(editor.undo()).toBe(true);
		expect(editor.value.nodes).toHaveLength(2);
	});

	it("selects and copies a complete rectangular subgraph", async () => {
		const editor = new TpGraphEditor();
		editor.value = {
			version: 1,
			nodes: [
				{ id: "inside-a", type: "node", x: 80, y: 80 },
				{ id: "inside-b", type: "node", x: 180, y: 160 },
				{ id: "outside", type: "node", x: 420, y: 320 },
			],
			edges: [{ id: "inside-edge", source: "inside-a", target: "inside-b" }],
		};
		document.body.append(editor);
		await new Promise<void>((resolve) =>
			window.requestAnimationFrame(() => resolve()),
		);
		editor.querySelector<HTMLElement>('[data-action="select-area"]')?.click();
		editor.querySelector(".tp-graph-canvas")?.dispatchEvent(
			new MouseEvent("pointerdown", {
				bubbles: true,
				clientX: 40,
				clientY: 40,
			}),
		);
		editor.dispatchEvent(
			new MouseEvent("pointermove", {
				bubbles: true,
				clientX: 240,
				clientY: 220,
			}),
		);
		editor.dispatchEvent(
			new MouseEvent("pointerup", {
				bubbles: true,
				clientX: 240,
				clientY: 220,
			}),
		);

		expect(editor.querySelectorAll(".tp-graph-node.is-selected")).toHaveLength(
			2,
		);
		expect(editor.querySelectorAll(".tp-graph-edge.is-selected")).toHaveLength(
			1,
		);
		expect(editor.querySelector(".tp-graph-selection-area")).toBeNull();
		expect(
			editor.querySelectorAll(
				".tp-graph-node.is-selected > .tp-graph-selection-indicator",
			),
		).toHaveLength(2);
		await Promise.resolve();
		expect(document.activeElement).toBe(
			editor.querySelector(".tp-graph-canvas"),
		);
		editor
			.querySelector(".tp-graph-canvas")
			?.dispatchEvent(
				new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }),
			);
		expect(editor.value.nodes.find((node) => node.id === "inside-a")?.x).toBe(
			81,
		);
		expect(editor.value.nodes.find((node) => node.id === "inside-b")?.x).toBe(
			181,
		);
		expect(editor.value.nodes.find((node) => node.id === "outside")?.x).toBe(
			420,
		);
		expect(editor.copy()).toBe(true);
		expect(editor.paste()).not.toBeNull();
		expect(editor.value.nodes).toHaveLength(5);
		expect(editor.value.edges).toHaveLength(2);
		const pastedEdge = editor.value.edges[1];
		expect(pastedEdge?.source).not.toBe("inside-a");
		expect(pastedEdge?.target).not.toBe("inside-b");
	});

	it("colors comments and adjusts their height to multiline content", async () => {
		const editor = new TpGraphEditor();
		document.body.append(editor);
		await new Promise<void>((resolve) =>
			window.requestAnimationFrame(() => resolve()),
		);
		const comment = editor.addNode("comment", { x: 200, y: 180 }, "One");
		editor.setCommentColor(comment.id, "danger");
		const shortHeight = Number(
			editor
				.querySelector(`[data-node-id="${comment.id}"] rect`)
				?.getAttribute("height"),
		);
		editor.setElementLabel(
			comment.id,
			"A long comment automatically wraps onto several visual lines without explicit line breaks",
		);
		const shape = editor.querySelector(`[data-node-id="${comment.id}"] rect`);
		expect(shape?.classList.contains("tp-graph-comment-danger")).toBe(true);
		expect(Number(shape?.getAttribute("height"))).toBeGreaterThan(shortHeight);
		expect(
			editor.querySelectorAll(`[data-node-id="${comment.id}"] tspan`).length,
		).toBeGreaterThan(1);
	});

	it("chooses the next comment color from a palette dropdown", async () => {
		const editor = new TpGraphEditor();
		document.body.append(editor);
		await new Promise<void>((resolve) =>
			window.requestAnimationFrame(() => resolve()),
		);
		const dropdown = editor.querySelector(
			".tp-graph-palette-comment-control tp-dropdown",
		);
		expect(dropdown).not.toBeNull();
		expect(
			editor.querySelector(
				'[data-shape="comment"] > .tp-graph-comment-palette-swatch',
			),
		).toBeNull();
		editor.querySelector<HTMLElement>('[data-shape="comment"]')?.click();
		expect(dropdown?.hasAttribute("open")).toBe(true);
		const danger = editor.querySelector<HTMLElement>(
			'[data-comment-palette-color="danger"]',
		);
		expect(danger?.textContent?.trim()).toBe("");
		danger?.click();
		expect(
			editor.querySelector(
				".tp-graph-comment-palette-swatch.tp-graph-comment-swatch-danger",
			),
		).not.toBeNull();
		const dataTransfer = {
			dropEffect: "none",
			effectAllowed: "copy",
			files: [],
			items: [],
			types: [],
			clearData: () => {},
			getData: (type: string) =>
				type === "application/x-tp-graph-shape" ? "comment" : "",
			setData: () => {},
			setDragImage: () => {},
		} as unknown as DataTransfer;
		const drop = new MouseEvent("drop", {
			bubbles: true,
			cancelable: true,
			clientX: 120,
			clientY: 100,
		});
		Object.defineProperty(drop, "dataTransfer", { value: dataTransfer });
		editor.querySelector(".tp-graph-canvas")?.dispatchEvent(drop);
		expect(editor.value.nodes[0]?.data?.color).toBe("danger");
	});

	it("edits a node label in place after a double click", async () => {
		const editor = new TpGraphEditor();
		document.body.append(editor);
		await new Promise<void>((resolve) =>
			window.requestAnimationFrame(() => resolve()),
		);
		const node = editor.addNode("node", { x: 80, y: 80 }, "Before");
		editor.querySelector(`[data-node-id="${node.id}"]`)?.dispatchEvent(
			new MouseEvent("click", {
				bubbles: true,
				detail: 2,
			}),
		);
		const input = editor.querySelector<HTMLInputElement>(
			".tp-graph-label-editor",
		);
		expect(input?.value).toBe("Before");
		expect(input?.parentElement?.classList.contains("tp-graph-workspace")).toBe(
			true,
		);
		expect(input?.style.left).toBe("80px");
		expect(input?.style.top).toBe("80px");
		if (input) {
			input.value = "After";
			input.dispatchEvent(
				new KeyboardEvent("keydown", { bubbles: true, key: "Enter" }),
			);
		}
		expect(editor.value.nodes[0]?.label).toBe("After");
		expect(editor.querySelector(".tp-graph-label-editor")).toBeNull();
	});

	it("opens the inline label editor on successive double-clicks", async () => {
		const editor = new TpGraphEditor();
		document.body.append(editor);
		await new Promise<void>((resolve) =>
			window.requestAnimationFrame(() => resolve()),
		);
		const node = editor.addNode("node", { x: 80, y: 80 }, "First");
		const doubleClick = (): void => {
			editor.querySelector(`[data-node-id="${node.id}"]`)?.dispatchEvent(
				new MouseEvent("click", {
					bubbles: true,
					detail: 2,
				}),
			);
		};
		doubleClick();
		const firstInput = editor.querySelector<HTMLInputElement>(
			".tp-graph-label-editor",
		);
		expect(firstInput?.value).toBe("First");
		firstInput?.dispatchEvent(
			new KeyboardEvent("keydown", { bubbles: true, key: "Enter" }),
		);
		doubleClick();
		expect(
			editor.querySelector<HTMLInputElement>(".tp-graph-label-editor")?.value,
		).toBe("First");
	});

	it("uses the native double-click event as a fallback for the selected element", async () => {
		const editor = new TpGraphEditor();
		document.body.append(editor);
		await new Promise<void>((resolve) =>
			window.requestAnimationFrame(() => resolve()),
		);
		const node = editor.addNode("node", { x: 80, y: 80 }, "Native");
		editor.querySelector(`[data-node-id="${node.id}"]`)?.dispatchEvent(
			new MouseEvent("pointerdown", {
				bubbles: true,
				clientX: 200,
				clientY: 160,
			}),
		);
		editor.dispatchEvent(
			new MouseEvent("dblclick", {
				bubbles: true,
				clientX: 200,
				clientY: 160,
			}),
		);
		expect(
			editor.querySelector<HTMLInputElement>(".tp-graph-label-editor")?.value,
		).toBe("Native");
	});

	it("keeps a clicked node mounted so a native double-click can edit it", async () => {
		const editor = new TpGraphEditor();
		document.body.append(editor);
		await new Promise<void>((resolve) =>
			window.requestAnimationFrame(() => resolve()),
		);
		const node = editor.addNode("node", { x: 80, y: 80 }, "Direct");
		const element = editor.querySelector<SVGGElement>(
			`[data-node-id="${node.id}"]`,
		);
		element?.dispatchEvent(
			new MouseEvent("pointerdown", {
				bubbles: true,
				clientX: 80,
				clientY: 80,
			}),
		);
		element?.dispatchEvent(
			new MouseEvent("pointerup", { bubbles: true, clientX: 80, clientY: 80 }),
		);
		expect(editor.querySelector(`[data-node-id="${node.id}"]`)).toBe(element);
		element?.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
		expect(
			editor.querySelector<HTMLInputElement>(".tp-graph-label-editor")?.value,
		).toBe("Direct");
	});

	it("tolerates small pointer movements during a double-click", async () => {
		const editor = new TpGraphEditor();
		document.body.append(editor);
		await new Promise<void>((resolve) =>
			window.requestAnimationFrame(() => resolve()),
		);
		const node = editor.addNode("node", { x: 80, y: 80 }, "Steady");
		const element = editor.querySelector<SVGGElement>(
			`[data-node-id="${node.id}"]`,
		);
		element?.dispatchEvent(
			new MouseEvent("pointerdown", {
				bubbles: true,
				clientX: 80,
				clientY: 80,
			}),
		);
		element?.dispatchEvent(
			new MouseEvent("pointermove", {
				bubbles: true,
				clientX: 82,
				clientY: 81,
			}),
		);
		element?.dispatchEvent(
			new MouseEvent("pointerup", { bubbles: true, clientX: 82, clientY: 81 }),
		);
		expect(editor.querySelector(`[data-node-id="${node.id}"]`)).toBe(element);
		element?.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
		expect(
			editor.querySelector<HTMLInputElement>(".tp-graph-label-editor")?.value,
		).toBe("Steady");
	});

	it("deletes a selected node with the Del key", async () => {
		const editor = new TpGraphEditor();
		document.body.append(editor);
		await new Promise<void>((resolve) =>
			window.requestAnimationFrame(() => resolve()),
		);
		const node = editor.addNode("node", { x: 80, y: 80 });
		const element = editor.querySelector<SVGGElement>(
			`[data-node-id="${node.id}"]`,
		);
		element?.dispatchEvent(
			new MouseEvent("pointerdown", {
				bubbles: true,
				clientX: 80,
				clientY: 80,
			}),
		);
		element?.dispatchEvent(
			new KeyboardEvent("keydown", { bubbles: true, key: "Del" }),
		);
		expect(editor.value.nodes).toHaveLength(0);
	});

	it("does not replace a node in the DOM when selecting it", async () => {
		const editor = new TpGraphEditor();
		document.body.append(editor);
		await new Promise<void>((resolve) =>
			window.requestAnimationFrame(() => resolve()),
		);
		const node = editor.addNode("node", { x: 80, y: 80 }, "Persistent");
		const before = editor.querySelector(`[data-node-id="${node.id}"]`);
		before?.dispatchEvent(
			new MouseEvent("pointerdown", {
				bubbles: true,
				clientX: 80,
				clientY: 80,
			}),
		);
		const after = editor.querySelector(`[data-node-id="${node.id}"]`);
		expect(after).toBe(before);
		expect(after?.classList.contains("is-selected")).toBe(true);
	});

	it("does not create a node when the empty canvas is clicked", async () => {
		const editor = new TpGraphEditor();
		document.body.append(editor);
		await new Promise<void>((resolve) =>
			window.requestAnimationFrame(() => resolve()),
		);
		editor.querySelector(".tp-graph-canvas")?.dispatchEvent(
			new MouseEvent("pointerdown", {
				bubbles: true,
				clientX: 200,
				clientY: 160,
			}),
		);
		expect(editor.value.nodes).toHaveLength(0);
	});

	it("adds a node only when a palette shape is dropped on the canvas", async () => {
		const editor = new TpGraphEditor();
		document.body.append(editor);
		await new Promise<void>((resolve) =>
			window.requestAnimationFrame(() => resolve()),
		);
		const values = new Map<string, string>();
		const dataTransfer = {
			dropEffect: "none",
			effectAllowed: "all",
			files: [],
			items: [],
			types: [],
			clearData: () => values.clear(),
			getData: (type: string) => values.get(type) ?? "",
			setData: (type: string, value: string) => {
				values.set(type, value);
			},
			setDragImage: () => {},
		} as unknown as DataTransfer;
		const palette = editor.querySelector<HTMLButtonElement>(
			'[data-shape="node"]',
		);
		expect(palette?.draggable).toBe(true);
		const dragStart = new Event("dragstart", {
			bubbles: true,
			cancelable: true,
		});
		Object.defineProperty(dragStart, "dataTransfer", { value: dataTransfer });
		palette?.dispatchEvent(dragStart);
		const drop = new MouseEvent("drop", {
			bubbles: true,
			cancelable: true,
			clientX: 120,
			clientY: 90,
		});
		Object.defineProperty(drop, "dataTransfer", { value: dataTransfer });
		editor.querySelector(".tp-graph-canvas")?.dispatchEvent(drop);
		expect(editor.value.nodes).toHaveLength(1);
		expect(editor.value.nodes[0]).toMatchObject({
			type: "node",
			x: 120,
			y: 90,
		});
	});

	it("creates an edge by dragging from one attachment port to another", async () => {
		const editor = new TpGraphEditor();
		document.body.append(editor);
		await new Promise<void>((resolve) =>
			window.requestAnimationFrame(() => resolve()),
		);
		const source = editor.addNode("node", { x: 100, y: 100 }, "Source");
		const target = editor.addNode("state", { x: 300, y: 100 }, "Target");
		editor
			.querySelector(`[data-node-id="${source.id}"] [data-port="east"]`)
			?.dispatchEvent(
				new MouseEvent("pointerdown", {
					bubbles: true,
					clientX: 152,
					clientY: 100,
				}),
			);
		const scene = editor.querySelector(".tp-graph-scene");
		expect(
			scene?.lastElementChild?.classList.contains("tp-graph-connection-draft"),
		).toBe(true);
		editor
			.querySelector(`[data-node-id="${target.id}"] [data-port="west"]`)
			?.dispatchEvent(
				new MouseEvent("pointerup", {
					bubbles: true,
					clientX: 268,
					clientY: 100,
				}),
			);
		expect(editor.value.edges).toEqual([
			expect.objectContaining({
				source: source.id,
				target: target.id,
				sourcePort: "east",
				targetPort: "west",
			}),
		]);
		const line = editor.querySelector<SVGPathElement>(".tp-graph-edge-line");
		expect(line?.getAttribute("d")).toBe("M 132 100 L 268 100");

		const secondSource = editor.addNode(
			"node",
			{ x: 100, y: 220 },
			"Second source",
		);
		editor
			.querySelector(`[data-node-id="${secondSource.id}"] [data-port="east"]`)
			?.dispatchEvent(
				new MouseEvent("pointerdown", {
					bubbles: true,
					clientX: 152,
					clientY: 220,
				}),
			);
		editor
			.querySelector(`[data-node-id="${target.id}"] .tp-graph-shape`)
			?.dispatchEvent(
				new MouseEvent("pointerup", {
					bubbles: true,
					clientX: 350,
					clientY: 100,
				}),
			);
		expect(editor.value.edges).toHaveLength(1);
	});

	it("preserves explicitly selected ports for self-links", async () => {
		const editor = new TpGraphEditor();
		document.body.append(editor);
		await new Promise<void>((resolve) =>
			window.requestAnimationFrame(() => resolve()),
		);
		const node = editor.addNode("node", { x: 100, y: 100 });
		const targetPorts = ["north", "south", "west", "north"] as const;
		for (const targetPort of targetPorts) {
			editor
				.querySelector(`[data-node-id="${node.id}"] [data-port="east"]`)
				?.dispatchEvent(
					new MouseEvent("pointerdown", {
						bubbles: true,
						clientX: 132,
						clientY: 100,
					}),
				);
			editor
				.querySelector(
					`[data-node-id="${node.id}"] [data-port="${targetPort}"]`,
				)
				?.dispatchEvent(
					new MouseEvent("pointerup", {
						bubbles: true,
						clientX: 100,
						clientY: 100,
					}),
				);
		}
		expect(editor.value.edges[0]).toMatchObject({
			sourcePort: "east",
			targetPort: "north",
		});
		expect(editor.value.edges[1]).toMatchObject({
			sourcePort: "east",
			targetPort: "south",
		});
		expect(editor.value.edges[2]).toMatchObject({
			sourcePort: "east",
			targetPort: "west",
		});
		expect(editor.value.edges[3]).toMatchObject({
			sourcePort: "east",
			targetPort: "north",
		});
	});

	it("reconnects either edge endpoint by dragging its handle to another node", async () => {
		const editor = new TpGraphEditor();
		editor.value = {
			version: 1,
			nodes: [
				{ id: "a", type: "node", x: 100, y: 100 },
				{ id: "b", type: "node", x: 320, y: 100 },
				{ id: "c", type: "node", x: 100, y: 240 },
			],
			edges: [
				{
					id: "edge",
					source: "a",
					target: "b",
					sourcePort: "east",
					targetPort: "west",
				},
			],
		};
		document.body.append(editor);
		await new Promise<void>((resolve) =>
			window.requestAnimationFrame(() => resolve()),
		);
		const edge = editor.querySelector<SVGGElement>('[data-edge-id="edge"]');
		edge
			?.querySelector(".tp-graph-edge-hit-area")
			?.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true }));
		expect(edge?.classList.contains("is-selected")).toBe(true);
		edge?.querySelector('[data-edge-endpoint="source"]')?.dispatchEvent(
			new MouseEvent("pointerdown", {
				bubbles: true,
				clientX: 152,
				clientY: 100,
			}),
		);
		editor
			.querySelector('[data-node-id="c"] [data-port="east"]')
			?.dispatchEvent(
				new MouseEvent("pointerup", {
					bubbles: true,
					clientX: 100,
					clientY: 240,
				}),
			);
		expect(editor.value.edges[0]).toMatchObject({
			id: "edge",
			source: "c",
			target: "b",
			sourcePort: "east",
			targetPort: "west",
		});
	});

	it("detaches both endpoints when the whole edge is moved", async () => {
		const editor = new TpGraphEditor();
		editor.value = {
			version: 1,
			nodes: [
				{ id: "a", type: "node", x: 100, y: 100 },
				{ id: "b", type: "node", x: 300, y: 100 },
			],
			edges: [
				{
					id: "edge",
					source: "a",
					target: "b",
					sourcePort: "east",
					targetPort: "west",
				},
			],
		};
		document.body.append(editor);
		await new Promise<void>((resolve) =>
			window.requestAnimationFrame(() => resolve()),
		);
		const hitArea = editor.querySelector(".tp-graph-edge-hit-area");
		hitArea?.dispatchEvent(
			new MouseEvent("pointerdown", {
				bubbles: true,
				clientX: 200,
				clientY: 100,
			}),
		);
		editor.dispatchEvent(
			new MouseEvent("pointermove", {
				bubbles: true,
				clientX: 240,
				clientY: 150,
			}),
		);
		editor.dispatchEvent(new MouseEvent("pointerup", { bubbles: true }));
		expect(editor.value.edges[0]).toMatchObject({
			id: "edge",
			sourcePoint: { x: 172, y: 150 },
			targetPoint: { x: 308, y: 150 },
		});
		expect(editor.value.edges[0]?.source).toBeUndefined();
		expect(editor.value.edges[0]?.target).toBeUndefined();
		expect(
			editor.querySelectorAll('[data-edge-id="edge"] .tp-graph-edge-handle'),
		).toHaveLength(2);
	});

	it("renders four attachment ports on every generic node type", async () => {
		const editor = new TpGraphEditor();
		editor.value = {
			version: 1,
			nodes: [
				{ id: "node", type: "node", x: 100, y: 100 },
				{ id: "decision", type: "decision", x: 250, y: 100 },
				{ id: "state", type: "state", x: 400, y: 100 },
			],
			edges: [],
		};
		document.body.append(editor);
		await new Promise<void>((resolve) =>
			window.requestAnimationFrame(() => resolve()),
		);
		for (const id of ["node", "decision", "state"]) {
			expect(
				editor.querySelectorAll(`[data-node-id="${id}"] .tp-graph-port`),
			).toHaveLength(4);
		}
		expect(
			editor.querySelector(
				'[data-shape="node"] .tp-graph-palette-preview circle',
			),
		).not.toBeNull();
		expect(editor.querySelector('[data-shape="decision"]')).toBeNull();
		expect(editor.querySelector('[data-shape="state"]')).toBeNull();
		expect(editor.querySelectorAll("[data-edge-direction]")).toHaveLength(4);
		editor.querySelector<HTMLElement>('[data-edge-direction="none"]')?.click();
		const edge = editor.addEdge("node", "state");
		expect(edge.direction).toBe("none");
	});

	it("covers the remaining public editing, display and palette operations", async () => {
		const editor = new TpGraphEditor();
		editor.value = {
			version: 1,
			nodes: [
				{ id: "a", type: "node", x: 20, y: 20 },
				{ id: "b", type: "node", x: 120, y: 20 },
			],
			edges: [{ id: "edge", source: "a", target: "b", type: "edge" }],
		};
		editor.readonly = true;
		editor.readonly = false;
		editor.portsVisible = true;
		editor.portsVisible = false;
		editor.message = "Ready";
		expect(editor.message).toBe("Ready");
		editor.message = "";
		editor.src = " /graph.json ";
		expect(editor.src).toBe("/graph.json");
		editor.src = "";
		document.body.append(editor);
		await new Promise<void>((resolve) =>
			window.requestAnimationFrame(() => resolve()),
		);
		editor.zoomIn();
		editor.zoomOut();
		editor.resetZoom();
		editor.zoom = 10;
		expect(editor.zoom).toBe(4);
		expect(() => editor.setZoom(0)).toThrow("positive finite");
		editor.registerPalette({
			id: "temporary",
			label: "Temporary",
			shapes: [{ type: "temporary", label: "Temporary" }],
		});
		editor.unregisterPalette("temporary");
		expect(() =>
			editor.registerPalette({ id: "", label: "", shapes: [] }),
		).toThrow("palette");
		editor.setEdgeRouting("edge", "orthogonal");
		editor.setEdgeOrthogonal("edge", 2, "vertical", "same");
		expect(editor.value.edges[0]).toMatchObject({
			routing: "orthogonal",
			elbows: 2,
			departure: "vertical",
			turns: "same",
		});
		editor.setEdgeOrthogonal("edge", 1, "horizontal", "same");
		expect(editor.value.edges[0]?.turns).toBe("alternating");
		expect(() => editor.setEdgeRouting("missing", "straight")).toThrow(
			"Unknown graph edge",
		);
		expect(() => editor.setEdgeOrthogonal("missing", 1, "horizontal")).toThrow(
			"Unknown graph edge",
		);
		editor.removeElement("a");
		expect(editor.value.nodes.some(({ id }) => id === "a")).toBe(false);
		expect(editor.value.edges).toHaveLength(0);
		editor.disconnectedCallback();
	}, 15_000);

	it("reports every structural graph-schema refinement", () => {
		const result = TpGraphDocumentSchema.safeParse({
			version: 1,
			nodes: [
				{ id: "hub", type: "hub", x: 0, y: 0 },
				{ id: "hub", type: "hub", x: 1, y: 1 },
			],
			edges: [
				{ id: "hub", source: "missing", target: "missing" },
				{ id: "loop", source: "hub", target: "hub" },
				{
					id: "measurements",
					sourcePoint: { x: 0, y: 0 },
					targetPoint: { x: 1, y: 1 },
					data: {
						measurements: [
							{ id: "same", position: 0.5 },
							{ id: "same", position: 0.75 },
						],
					},
				},
				{
					id: "invalid-measurement",
					sourcePoint: { x: 0, y: 0 },
					targetPoint: { x: 1, y: 1 },
					data: { measurements: [{ id: "", position: 2 }] },
				},
				{ id: "detached" },
			],
		});
		expect(result.success).toBe(false);
		if (result.success) throw new Error("Expected graph validation to fail");
		const message = formatGraphSchemaError(result.error);
		expect(message).toContain("Duplicate id");
		expect(message).toContain("Unknown node");
		expect(message).toContain("Self-links are not allowed");
		expect(message).toContain("Measurement ids must be unique");
		expect(message).toContain("Measurements must have a unique id");
		expect(message).toContain("A source node or sourcePoint is required");
		expect(message).toContain("A target node or targetPoint is required");
	});

	it("exercises the complete generic toolbar through user-facing controls", async () => {
		const editor = new TpGraphEditor();
		editor.value = {
			version: 1,
			nodes: [
				{ id: "a", type: "node", x: 40, y: 40 },
				{ id: "b", type: "node", x: 180, y: 40 },
			],
			edges: [{ id: "edge", source: "a", target: "b", type: "edge" }],
		};
		document.body.append(editor);
		await new Promise<void>((resolve) =>
			window.requestAnimationFrame(() => resolve()),
		);
		const click = (selector: string): void => {
			editor
				.querySelector(selector)
				?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
		};
		click('[data-edge-routing="orthogonal"]');
		click(
			'[data-edge-orthogonal][data-edge-elbows="2"][data-edge-departure="vertical"]',
		);
		click('[data-action="select-area"]');
		click('[data-action="toggle-grid"]');
		click('[data-action="palette-expand"]');
		click('[data-action="palette-collapse"]');
		click('[data-action="zoom-in"]');
		click('[data-action="zoom-out"]');
		click('[data-node-id="a"]');
		click('[data-action="copy"]');
		click('[data-action="paste"]');
		click('[data-action="cut"]');
		click('[data-action="undo"]');
		click('[data-action="redo"]');
		click('[data-action="title"]');
		const title = editor.querySelector<HTMLInputElement>(
			".tp-graph-title-editor",
		);
		if (title !== null) {
			title.value = "Toolbar graph";
			title.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
		}
		click('[data-action="import"]');
		editor
			.querySelector<HTMLElement>("[data-comment-palette-color]")
			?.dispatchEvent(
				new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
			);
		editor
			.querySelector(".tp-graph-canvas")
			?.dispatchEvent(new Event("dragleave", { bubbles: true }));
		const importInput = editor.querySelector<HTMLInputElement>(
			'[data-role="import"]',
		);
		const imported = new File(
			[JSON.stringify({ version: 1, title: "Imported", nodes: [], edges: [] })],
			"toolbar.json",
		);
		Object.defineProperty(importInput, "files", {
			configurable: true,
			value: [imported],
		});
		importInput?.dispatchEvent(new Event("change"));
		await vi.waitFor(() => expect(editor.value.title).toBe("Imported"));
		expect(editor.hasAttribute("grid")).toBe(true);
		expect(editor.zoom).toBeCloseTo(1);
		expect(editor.value.title).toBe("Imported");
	}, 15_000);

	it("covers geometry and disconnected interaction fallbacks", () => {
		const editor = new TpGraphEditor();
		editor.value = {
			version: 1,
			nodes: [
				{ id: "a", type: "node", x: 0, y: 0 },
				{ id: "b", type: "node", x: 200, y: 100 },
			],
			edges: [],
		};
		const api = editor as unknown as {
			edgePolyline(
				edge: Record<string, unknown>,
			): Array<{ x: number; y: number }>;
			edgePointAt(
				edge: Record<string, unknown>,
				position: number,
			): { x: number; y: number };
			edgePositionNear(id: string, point: { x: number; y: number }): number;
			setPan(x: number, y: number): boolean;
			finishAreaSelection(): void;
			cancelConnection(): void;
			cancelEdgeReconnect(): void;
			removeMeasurements(ids: ReadonlySet<string>): void;
			snap(value: number): number;
		};
		const variants = [
			{ source: "a", target: "b", routing: "straight" },
			{
				source: "a",
				target: "b",
				routing: "orthogonal",
				elbows: 1,
				departure: "horizontal",
			},
			{
				source: "a",
				target: "b",
				routing: "orthogonal",
				elbows: 1,
				departure: "vertical",
			},
			{
				source: "a",
				target: "b",
				routing: "orthogonal",
				elbows: 2,
				departure: "horizontal",
				turns: "same",
			},
			{
				source: "a",
				target: "b",
				routing: "orthogonal",
				elbows: 2,
				departure: "vertical",
				turns: "same",
			},
			{
				source: "a",
				target: "b",
				routing: "orthogonal",
				elbows: 3,
				departure: "horizontal",
				bendX: 40,
				bendY: 70,
			},
			{
				source: "a",
				target: "b",
				routing: "orthogonal",
				elbows: 3,
				departure: "vertical",
			},
			{
				sourcePoint: { x: 1, y: 2 },
				targetPoint: { x: 1, y: 2 },
				routing: "straight",
			},
		];
		for (const edge of variants) {
			expect(api.edgePolyline(edge).length).toBeGreaterThan(0);
			expect(api.edgePointAt(edge, -1)).toEqual(
				expect.objectContaining({ x: expect.any(Number) }),
			);
			expect(api.edgePointAt(edge, 2)).toEqual(
				expect.objectContaining({ y: expect.any(Number) }),
			);
		}
		expect(api.edgePolyline({ source: "missing", target: "b" })).toEqual([]);
		expect(api.edgePositionNear("missing", { x: 0, y: 0 })).toBe(0.5);
		expect(api.setPan(10, 10)).toBe(false);
		api.finishAreaSelection();
		api.cancelConnection();
		api.cancelEdgeReconnect();
		api.removeMeasurements(new Set(["missing"]));
		expect(api.snap(13)).toBeTypeOf("number");
	});

	it("covers each pointer-move interaction state", async () => {
		const editor = new TpGraphEditor();
		editor.value = {
			version: 1,
			nodes: [
				{ id: "a", type: "node", x: 20, y: 20 },
				{ id: "b", type: "node", x: 220, y: 120 },
			],
			edges: [
				{
					id: "edge",
					source: "a",
					target: "b",
					type: "edge",
					routing: "orthogonal",
					bendX: 100,
					bendY: 80,
					data: { measurements: [{ id: "measure", position: 0.5 }] },
				},
			],
		};
		document.body.append(editor);
		await new Promise<void>((resolve) =>
			window.requestAnimationFrame(() => resolve()),
		);
		const api = editor as unknown as {
			onPointerMove(event: PointerEvent, svg: SVGSVGElement): void;
			measurementDrag: unknown;
			selectionDraft: unknown;
			minimapDrag: unknown;
			edgeBendDrag: unknown;
			edgeReconnectDraft: unknown;
			edgeDrag: unknown;
			connectionDraft: unknown;
			drag: unknown;
		};
		const move = (): PointerEvent =>
			new PointerEvent("pointermove", { clientX: 180, clientY: 100 });
		const canvas = (): SVGSVGElement => {
			const value = editor.querySelector<SVGSVGElement>(".tp-graph-canvas");
			if (value === null) throw new Error("Expected graph canvas");
			return value;
		};
		api.measurementDrag = { edgeId: "edge", measurementId: "measure" };
		api.onPointerMove(move(), canvas());
		api.measurementDrag = null;
		api.selectionDraft = { start: { x: 0, y: 0 }, current: { x: 0, y: 0 } };
		api.onPointerMove(move(), canvas());
		api.selectionDraft = null;
		api.edgeBendDrag = { edgeId: "edge", axis: "x" };
		api.onPointerMove(move(), canvas());
		api.edgeBendDrag = { edgeId: "edge", axis: "y" };
		api.onPointerMove(move(), canvas());
		api.edgeBendDrag = null;
		api.edgeReconnectDraft = { edgeId: "edge", endpoint: "source" };
		api.onPointerMove(move(), canvas());
		api.edgeReconnectDraft = null;
		api.edgeDrag = {
			edgeId: "edge",
			startClient: { x: 0, y: 0 },
			pointer: { x: 0, y: 0 },
			source: { x: 20, y: 20 },
			target: { x: 220, y: 120 },
			bendX: 100,
			bendY: 80,
			moved: false,
		};
		api.onPointerMove(move(), canvas());
		api.edgeDrag = null;
		api.connectionDraft = {
			sourceId: "a",
			sourcePort: "right",
			direction: "forward",
		};
		api.onPointerMove(move(), canvas());
		api.connectionDraft = null;
		api.drag = {
			id: "a",
			offset: { x: 0, y: 0 },
			startClient: { x: 0, y: 0 },
			moved: false,
		};
		api.onPointerMove(move(), canvas());
		expect(editor.value.nodes[0]).toMatchObject({
			x: expect.any(Number),
			y: expect.any(Number),
		});
	});

	it("covers defensive public API and transition branches", async () => {
		const editor = new TpGraphEditor();
		expect(editor.copy()).toBe(false);
		expect(editor.cut()).toBe(false);
		expect(editor.paste()).toBeNull();
		expect(editor.undo()).toBe(false);
		expect(editor.redo()).toBe(false);
		expect(() => editor.exportSvg()).toThrow("not ready");
		expect(() => editor.setCommentColor("missing", "neutral")).toThrow(
			"Unknown graph comment",
		);
		expect(() => editor.setCommentColor("missing", "invalid" as never)).toThrow(
			"Unsupported comment color",
		);
		expect(() =>
			editor.setEdgeDirection("missing", "invalid" as never),
		).toThrow("Unsupported edge direction");
		expect(() => editor.addMeasurement("missing")).toThrow(
			"Unknown graph edge",
		);
		expect(() => editor.moveMeasurement("missing", 0)).toThrow(
			"Unknown graph measurement",
		);
		expect(() => editor.step("missing")).rejects.toThrow(
			"Unknown graph simulator",
		);
		const hub = editor.addNode("hub", { x: 0, y: 0 });
		expect(() => editor.addEdge(hub.id, hub.id)).toThrow(
			"Self-links are not allowed",
		);
		const a = editor.addNode("node", { x: 10, y: 10 });
		const b = editor.addNode("node", { x: 100, y: 10 });
		const edge = editor.addEdge(a.id, b.id);
		const measurement = editor.addMeasurement(edge.id, 2, " label ");
		expect(measurement).toMatchObject({ position: 1, label: "label" });
		editor.moveMeasurement(measurement.id, -1);
		editor.setElementLabel(measurement.id, "");
		editor.setElementLabel(edge.id, " edge ");
		expect(() => editor.setElementLabel("missing", "")).toThrow(
			"Unknown graph element",
		);
		await editor.animateTransition({
			duration: 0,
			nodes: { [a.id]: { label: "A" }, missing: { label: "Missing" } },
			edges: { [edge.id]: { label: "E" }, missing: { label: "Missing" } },
		});
		editor.readonly = true;
		expect(editor.cut()).toBe(false);
		expect(editor.paste()).toBeNull();
	});
});
