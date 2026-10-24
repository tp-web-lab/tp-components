import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const initialize = vi.fn();
const mermaidLoaded = vi.fn();
const bindFunctions = vi.fn();
const render = vi.fn(async (id: string, source: string) => ({
	bindFunctions,
	svg: `<svg id="${id}"><text>${source}</text></svg>`,
}));

const peleRender = vi.fn((_source: string, _options: object) => ({
	svg: "<svg><text>Pele</text></svg>",
}));
vi.mock("pele", () => ({ render: peleRender }));

vi.mock("mermaid", () => {
	mermaidLoaded();
	return { default: { initialize, render } };
});

import "./diagram.js";
import { TpDiagram } from "./diagram.js";

async function settle(): Promise<void> {
	await new Promise((resolve) => setTimeout(resolve, 0));
}

describe("<tp-diagram>", () => {
	beforeEach(() => {
		document.head.innerHTML = "";
		document.body.innerHTML = "";
		vi.clearAllMocks();
	});

	afterEach(() => vi.unstubAllGlobals());

	it("uses Pele without importing Mermaid for absent, empty or unknown engine", async () => {
		for (const value of [null, "", "unknown", "pele"]) {
			const element = document.createElement("tp-diagram");
			if (value !== null) element.setAttribute("engine", value);
			element.innerHTML =
				'<script type="tp/diagram">flowchart LR\n A --> B</script>';
			document.body.append(element);
			await settle();
			expect(element.engine).toBe("pele");
			expect(element.querySelector("svg")).not.toBeNull();
		}
		expect(peleRender).toHaveBeenCalledTimes(4);
		expect(mermaidLoaded).not.toHaveBeenCalled();
		expect(render).not.toHaveBeenCalled();
	});

	it("renders an inline Mermaid script as an accessible SVG", async () => {
		const element = document.createElement("tp-diagram");
		element.engine = "mermaid";
		element.setAttribute("label", "Request flow");
		element.innerHTML =
			'<script type="tp/diagram">flowchart LR\n  A --> B</script>';
		document.body.append(element);
		await settle();

		expect(element).toBeInstanceOf(TpDiagram);
		expect(render).toHaveBeenCalledWith(
			expect.stringMatching(/^tp-diagram-/),
			"flowchart LR\n  A --> B",
		);
		expect(element.querySelector("svg")?.getAttribute("role")).toBe("img");
		expect(element.querySelector("svg")?.getAttribute("aria-label")).toBe(
			"Request flow",
		);
		expect(bindFunctions).toHaveBeenCalled();
		expect(mermaidLoaded).toHaveBeenCalledOnce();
		expect(document.head.querySelectorAll("#tp-diagram-styles")).toHaveLength(
			1,
		);
	});

	it("waits for an inline script added immediately after connection", async () => {
		const element = document.createElement("tp-diagram");
		element.engine = "mermaid";
		document.body.append(element);
		element.innerHTML =
			'<script type="tp/diagram">flowchart LR\n  Parser --> Component</script>';
		element.setAttribute("label", "Parser timing");
		await settle();

		expect(render).toHaveBeenCalledWith(
			expect.stringMatching(/^tp-diagram-/),
			"flowchart LR\n  Parser --> Component",
		);
		expect(element.querySelector("svg")?.getAttribute("aria-label")).toBe(
			"Parser timing",
		);
	});

	it("renders an inline script added after its initial empty render", async () => {
		const element = document.createElement("tp-diagram");
		element.engine = "mermaid";
		document.body.append(element);
		await settle();
		element.innerHTML =
			'<script type="tp/diagram">flowchart LR\n  Late --> Source</script>';
		await settle();

		expect(render).toHaveBeenCalledWith(
			expect.stringMatching(/^tp-diagram-/),
			"flowchart LR\n  Late --> Source",
		);
		expect(element.getAttribute("data-source")).toContain('type="tp/diagram"');
		expect(element.getAttribute("data-source")).toContain("Late --> Source");
	});

	it("cancels its deferred first render when disconnected immediately", async () => {
		const element = document.createElement("tp-diagram");
		element.engine = "mermaid";
		document.body.append(element);
		element.remove();
		await settle();

		expect(render).not.toHaveBeenCalled();
	});

	it("keeps its tp/diagram inline source for rerenders", async () => {
		const element = document.createElement("tp-diagram");
		element.engine = "mermaid";
		element.innerHTML =
			'<script type="tp/diagram">sequenceDiagram\n  A->>B: Hello</script>';
		document.body.append(element);
		await settle();
		element.label = "Sequence";
		await settle();

		expect(render).toHaveBeenCalledTimes(2);
		expect(element.querySelector("svg")?.getAttribute("aria-label")).toBe(
			"Sequence",
		);
	});

	it("loads Mermaid source through src relative to the containing document", async () => {
		const fetchMock = vi.fn().mockResolvedValue({
			ok: true,
			text: async () => "classDiagram\n  Animal <|-- Duck",
		});
		vi.stubGlobal("fetch", fetchMock);
		const element = document.createElement("tp-diagram");
		element.engine = "mermaid";
		element.src = "diagram.mmd";
		document.body.append(element);
		await settle();

		expect(fetchMock).toHaveBeenCalledWith(
			expect.stringContaining("diagram.mmd"),
			{ cache: "no-store" },
		);
		expect(render).toHaveBeenCalledWith(
			expect.stringMatching(/^tp-diagram-/),
			"classDiagram\n  Animal <|-- Duck",
		);
	});

	it("clears empty content and reports HTTP and Mermaid errors accessibly", async () => {
		const empty = document.createElement("tp-diagram");
		document.body.append(empty);
		await settle();
		expect(empty.innerHTML).toBe("");

		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue({ ok: false, status: 404 }),
		);
		empty.src = "/missing.mmd";
		await settle();
		expect(empty.querySelector('[role="alert"]')?.textContent).toContain("404");

		render.mockRejectedValueOnce("<invalid>");
		const invalid = document.createElement("tp-diagram");
		invalid.engine = "mermaid";
		invalid.innerHTML = '<script type="tp/diagram">invalid</script>';
		document.body.append(invalid);
		await settle();
		expect(invalid.innerHTML).toContain("&lt;invalid&gt;");
	});

	it("switches engines without losing source, accessibility or completion events", async () => {
		const element = document.createElement("tp-diagram");
		element.engine = "pele";
		element.label = "Engine comparison";
		element.innerHTML =
			'<script type="tp/diagram">flowchart LR\n  A --> B</script>';
		const completed = vi.fn();
		element.addEventListener("tp-diagram-rendered", completed);
		document.body.append(element);
		await settle();
		expect(render).not.toHaveBeenCalled();
		expect(peleRender).toHaveBeenCalledWith(
			"flowchart LR\n  A --> B",
			expect.objectContaining({
				idPrefix: expect.stringMatching(/^tp-diagram-/),
				autoDirection: false,
				links: false,
				images: false,
			}),
		);
		expect(element.querySelector("svg")?.getAttribute("aria-label")).toBe(
			"Engine comparison",
		);
		expect(element.querySelector("svg")?.getAttribute("role")).toBe("img");
		expect(element.hasAttribute("aria-busy")).toBe(false);
		element.engine = "mermaid";
		await settle();
		expect(render).toHaveBeenCalledWith(
			expect.any(String),
			"flowchart LR\n  A --> B",
		);
		element.engine = "pele";
		await settle();
		element.removeAttribute("engine");
		await settle();
		expect(element.engine).toBe("pele");
		expect(render).toHaveBeenCalledTimes(1);
		expect(completed).toHaveBeenCalledTimes(4);
		element.setAttribute("engine", "unknown");
		expect(element.engine).toBe("pele");
	});

	it("escapes Pele errors and recovers when switching back to Mermaid", async () => {
		peleRender.mockImplementationOnce(() => {
			throw new Error("<invalid>");
		});
		const element = document.createElement("tp-diagram");
		element.engine = "pele";
		element.innerHTML =
			'<script type="tp/diagram">flowchart LR\n  A --> B</script>';
		document.body.append(element);
		await settle();
		expect(element.querySelector('[role="alert"]')?.textContent).toBe(
			"<invalid>",
		);
		expect(element.querySelector("invalid")).toBeNull();
		expect(element.hasAttribute("aria-busy")).toBe(false);
		expect(element.hasAttribute("data-tp-diagram-rendered")).toBe(false);
		element.engine = "mermaid";
		await settle();
		expect(element.querySelector("svg")).not.toBeNull();
	});

	it("renders actual Pele output through the component", async () => {
		const actual = await vi.importActual<typeof import("pele")>("pele");
		peleRender.mockImplementationOnce((source, options) =>
			actual.render(source, options),
		);
		const element = document.createElement("tp-diagram");
		element.engine = "pele";
		element.innerHTML =
			'<script type="tp/diagram">flowchart LR\n  Browser --> Server</script>';
		document.body.append(element);
		await settle();
		expect(element.querySelector("svg.pele")).not.toBeNull();
		expect(element.textContent).toContain("Browser");
		expect(element.textContent).toContain("Server");
	});

	it("reflects src and label properties", () => {
		const element = document.createElement("tp-diagram") as TpDiagram;
		expect(element.label).toBe("Diagram");
		element.label = "Architecture";
		element.src = "/architecture.mmd";
		expect(element.label).toBe("Architecture");
		expect(element.src).toBe("/architecture.mmd");
		element.label = " ";
		element.src = " ";
		expect(element.hasAttribute("label")).toBe(false);
		expect(element.hasAttribute("src")).toBe(false);
	});
});
