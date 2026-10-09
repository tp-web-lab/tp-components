import { afterEach, expect, it, vi } from "vitest";
import { openViewerSource } from "../../test-helpers/viewer-source.js";

vi.mock("../restructuredtext/restructuredtext.js", () => ({
	dedentRestructuredTextSource: (source: string) => source.trim(),
	parseRestructuredTextToAst: vi.fn(async () => ({ type: "document" })),
	renderRestructuredTextToHtml: vi.fn(
		async (source: string) => `<h1>${source}</h1>`,
	),
}));

vi.mock("@tp/tp-restructuredtext", () => ({
	extractRstViewerExamples: vi.fn(() => [{ label: "Named", source: "Body" }]),
}));

import "./restructuredtext-viewer.js";

afterEach(() => document.body.replaceChildren());

it.each([
	":latexmath:`\\frac{1}{x}`",
	":asciimath:`sqrt(x)`",
	".. latexmath::\n\n   x^2",
	".. asciimath::\n\n   sqrt(x)",
	".. role:: formula(latexmath)\n\n:formula:`x^2`",
])(
	"renders mathematical roles and directives inside the iframe runtime: %s",
	async (source) => {
		const viewer = document.createElement("tp-restructuredtext-viewer");
		const api = viewer as unknown as {
			renderOutput(
				source: string,
				mode: string,
				root: HTMLElement,
				context: URL,
			): Promise<void>;
		};
		const root = document.createElement("div");
		await api.renderOutput(
			source,
			"render",
			root,
			new URL("https://example.test/"),
		);
		expect(root.querySelector("iframe")?.srcdoc).toContain(
			'<tp-restructuredtext><script type="tp/restructuredtext">',
		);
		expect(root.querySelector("iframe")?.srcdoc).toContain(source);
	},
);
it("renders editable reStructuredText and its output", async () => {
	const element = document.createElement("tp-restructuredtext-viewer");
	element.innerHTML =
		'<script type="tp/restructuredtext">Hello\n=====</script>';
	document.body.append(element);
	await openViewerSource(element);
	await vi.waitFor(() =>
		expect(element.querySelector("tp-code-editor")).not.toBeNull(),
	);
	expect(element.querySelector('[data-role="output"]')).not.toBeNull();
}, 20_000);

it("covers public state, sources, examples and non-doctest output modes", async () => {
	const element = document.createElement(
		"tp-restructuredtext-viewer",
	) as HTMLElement & { doctest: boolean };
	element.innerHTML =
		'<script type="tp/restructuredtext">Title\n=====\n\nText</script>';
	const api = element as unknown as {
		readInlineSource(): { label: string; source: string; context: URL };
		extractExamples(value: {
			label: string;
			source: string;
			context: URL;
		}): Array<{ label: string }>;
		createExternalContext(url: URL): URL;
		renderOutput(
			source: string,
			mode: "render" | "html" | "ast",
			container: HTMLElement,
			context: URL,
		): Promise<void>;
	};
	element.doctest = true;
	expect(element.doctest).toBe(true);
	element.doctest = false;
	const source = api.readInlineSource();
	expect(api.extractExamples(source)).toHaveLength(1);
	expect(
		api.extractExamples({
			...source,
			source: ".. example:: Named\n\n   Body",
		})[0]?.label,
	).toBe("Named");
	expect(
		api.createExternalContext(new URL("https://example.test/a.rst")).href,
	).toBe("https://example.test/a.rst");

	for (const mode of ["render", "ast", "html"] as const) {
		const container = document.createElement("div");
		await api.renderOutput("Title", mode, container, source.context);
		expect(container.childElementCount).toBe(1);
		expect(container.dataset.tpSource).toBe(source.context.href);
	}

	element.doctest = true;
	const doctestOutput = document.createElement("div");
	const rendering = api.renderOutput(
		">>> 1 + 1",
		"render",
		doctestOutput,
		source.context,
	);
	const renderer = doctestOutput.querySelector("tp-restructuredtext");
	const renderedContent = document.createElement("div");
	renderedContent.className = "tp-restructuredtext-output";
	renderedContent.textContent = "1 + 1";
	renderer?.append(renderedContent);
	renderer?.dispatchEvent(new CustomEvent("tp-restructuredtext-rendered"));
	await rendering;
	expect(doctestOutput.textContent).toContain("1 + 1");

	element.innerHTML = "<template> Template source </template>";
	expect(api.readInlineSource().source).toContain("Template source");
	element.replaceChildren(document.createTextNode(" Text source "));
	expect(api.readInlineSource().source).toBe("Text source");
});
