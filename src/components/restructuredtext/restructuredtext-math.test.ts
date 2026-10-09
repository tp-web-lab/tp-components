import { expect, it, vi } from "vitest";
import {
	createTpRestructuredTextParser,
	renderRestructuredTextInto,
} from "./restructuredtext.js";

const mocks = vi.hoisted(() => ({ parser: vi.fn(), renderMath: vi.fn() }));

vi.mock("@tp/tp-restructuredtext", async (importOriginal) => ({
	...(await importOriginal<typeof import("@tp/tp-restructuredtext")>()),
	renderRstViewers: vi.fn(),
	TpRestructuredTextParser: class {
		constructor(options: unknown) {
			mocks.parser(options);
		}
		async render(): Promise<string> {
			return '<p><span class="math">\\(\\mathbb{R}_{+}\\)</span></p><div class="math">\\[\\frac{1}{2\\sqrt{x}}\\]</div>';
		}
	},
}));

vi.mock("@tp/tp-markdown/markdown/renderers/math", () => ({
	default: { render: mocks.renderMath },
}));

it("uses the shared SVG runtime for Docutils inline and display math", async () => {
	const root = document.createElement("div");
	await renderRestructuredTextInto(":math:`formula`", root);
	expect(mocks.parser).toHaveBeenCalledWith({});
	expect(root.querySelector("span")?.getAttribute("data-mathjax-tex")).toBe(
		"\\mathbb{R}_{+}",
	);
	expect(root.querySelector("span")?.getAttribute("data-mathjax-display")).toBe(
		"false",
	);
	expect(root.querySelector("div")?.getAttribute("data-mathjax-tex")).toBe(
		"\\frac{1}{2\\sqrt{x}}",
	);
	expect(root.querySelector("div")?.getAttribute("data-mathjax-display")).toBe(
		"true",
	);
	expect(root.textContent).toBe("");
	expect(mocks.renderMath).toHaveBeenCalledWith(expect.any(DocumentFragment));
});

it("preserves explicit parser settings", () => {
	createTpRestructuredTextParser({ settings: { math_output: "MathML" } });
	expect(mocks.parser).toHaveBeenLastCalledWith({
		settings: { math_output: "MathML" },
	});
});
