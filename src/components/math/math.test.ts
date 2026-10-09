import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { referenceContent } from "../../utilities/references.js";
import { renderMarkdownToHtml } from "../markdown/markdown.js";
import { TpMath } from "./math.js";

const { render } = vi.hoisted(() => ({ render: vi.fn() }));
vi.mock("@tp/tp-markdown/markdown/renderers/math", () => ({
	default: { render },
}));

/** Generates a minimal MathJax SVG while preserving the supplied placeholder. */
function draw(root: HTMLElement): void {
	const placeholder = root.firstElementChild;
	if (!placeholder) throw new Error("Missing math placeholder");
	const container = document.createElement("mjx-container");
	container.innerHTML =
		'<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" aria-labelledby="old"></svg>';
	placeholder.append(container);
}
/** Flushes deferred source acquisition and the serial rendering queue. */
async function settle(): Promise<void> {
	await vi.waitFor(() =>
		expect(document.querySelector("tp-math[aria-busy]")).toBeNull(),
	);
	await new Promise((resolve) => setTimeout(resolve, 15));
}
/** Creates a connected formula with declarative HTML content. */
function fixture(content = "", attributes = ""): TpMath {
	const wrapper = document.createElement("div");
	wrapper.innerHTML = `<tp-math ${attributes}>${content}</tp-math>`;
	const element = wrapper.firstElementChild;
	if (!(element instanceof TpMath)) throw new Error("Missing component");
	document.body.append(element);
	return element;
}
beforeEach(() => {
	render.mockReset();
	render.mockImplementation(async (root: HTMLElement) => draw(root));
});
afterEach(() => {
	document.body.replaceChildren();
	vi.unstubAllGlobals();
	vi.restoreAllMocks();
});

describe("tp-math", () => {
	it("receives the complete derivative formula from an inline Markdown role", async () => {
		const expression = String.raw`\displaystyle \lim_{x -> a} \frac{f(x)-f(a)}{x-a}`;
		const source = `Oui, le nombre dérivé d’une fonction :tp-math:\`f\`{} en un point :tp-math:\`a\`{}, c’est :tp-math:\`${expression}\`{}. Enfin du moins quand c’est réel.`;
		const root = document.createElement("div");
		root.innerHTML = await renderMarkdownToHtml(source);
		expect(
			[...root.querySelectorAll("tp-math")].map((node) => node.textContent),
		).toEqual(["f", "a", expression]);
		document.body.append(root);
		await vi.waitFor(() =>
			expect(root.querySelectorAll("tp-math svg")).toHaveLength(3),
		);
		expect(
			[...root.querySelectorAll("tp-math svg")].map((node) =>
				node.getAttribute("aria-label"),
			),
		).toEqual(["f", "a", expression]);
		expect(root.textContent).toContain("Enfin du moins quand c’est réel.");
	});
	it("renders inline LaTeX by default and labels its SVG", async () => {
		const element = fixture("a^2 + b^2 = c^2");
		const rendered = vi.fn();
		element.addEventListener("tp-math-rendered", rendered);
		await vi.waitFor(() => expect(rendered).toHaveBeenCalledOnce());
		expect(element.mode).toBe("latexmath");
		expect(element.value).toBe("");
		expect(element.src).toBe("");
		expect(element.label).toBe("");
		expect(element.displaystyle).toBe(false);
		const svg = element.querySelector("svg");
		expect(svg?.getAttribute("aria-label")).toBe("a^2 + b^2 = c^2");
		expect(svg?.getAttribute("role")).toBe("img");
		expect(svg?.hasAttribute("aria-hidden")).toBe(false);
		expect(svg?.hasAttribute("aria-labelledby")).toBe(false);
		expect(rendered.mock.calls[0]?.[0].detail).toEqual({
			value: "a^2 + b^2 = c^2",
			mode: "latexmath",
			displaystyle: false,
		});
	});
	it("updates attributes, coalesces changes, and uses boolean presence", async () => {
		const element = fixture();
		element.value = "sqrt(x)";
		element.mode = "asciimath";
		element.displaystyle = true;
		element.label = "Square root of x";
		await vi.waitFor(() => expect(element.querySelector("svg")).not.toBeNull());
		expect(render).toHaveBeenCalledOnce();
		expect(
			element
				.querySelector("[data-mathjax-asciimath]")
				?.getAttribute("data-mathjax-display"),
		).toBe("true");
		expect(element.querySelector("svg")?.getAttribute("aria-label")).toBe(
			element.label,
		);
		element.setAttribute("displaystyle", "false");
		expect(element.displaystyle).toBe(true);
		element.displaystyle = false;
		element.setAttribute("mode", "unknown");
		await vi.waitFor(() =>
			expect(element.querySelector("[data-mathjax-tex]")).not.toBeNull(),
		);
		expect(element.mode).toBe("latexmath");
		expect(element.hasAttribute("displaystyle")).toBe(false);
	});
	it("preserves scripts and honors src, value, script, text precedence", async () => {
		const fetcher = vi
			.fn()
			.mockResolvedValue({ ok: true, text: async () => "file expression" });
		vi.stubGlobal("fetch", fetcher);
		const element = fixture(
			'<script type="tp/math">script expression</script>',
			'value="attribute expression"',
		);
		await vi.waitFor(() =>
			expect(element.querySelector("svg")?.getAttribute("aria-label")).toBe(
				"attribute expression",
			),
		);
		element.src = "/formula.txt";
		await vi.waitFor(() =>
			expect(element.querySelector("svg")?.getAttribute("aria-label")).toBe(
				"file expression",
			),
		);
		expect(fetcher).toHaveBeenCalledWith(
			expect.stringContaining("/formula.txt"),
			expect.objectContaining({ signal: expect.any(AbortSignal) }),
		);
		element.src = "";
		element.value = "";
		await vi.waitFor(() =>
			expect(element.querySelector("svg")?.getAttribute("aria-label")).toBe(
				"script expression",
			),
		);
		element.remove();
		document.body.append(element);
		await settle();
		expect(element.querySelector("svg")?.getAttribute("aria-label")).toBe(
			"script expression",
		);
	});
	it("waits for late script content without treating generated output as source", async () => {
		const element = fixture();
		await settle();
		expect(render).not.toHaveBeenCalled();
		element.insertAdjacentHTML(
			"beforeend",
			'<script type="tp/txt">x+y</script>',
		);
		await vi.waitFor(() =>
			expect(element.querySelector("svg")?.getAttribute("aria-label")).toBe(
				"x+y",
			),
		);
		expect(element.querySelectorAll("[data-tp-math-output]")).toHaveLength(1);
	});
	it("reports loading errors safely and recovers on a new value", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue({ ok: false, status: 404 }),
		);
		const element = fixture("x", 'src="/unknown.txt"');
		const error = vi.fn();
		element.addEventListener("tp-math-error", error);
		await vi.waitFor(() => expect(error).toHaveBeenCalledOnce());
		expect(element.querySelector("tp-callout")?.textContent).toContain("404");
		element.src = "";
		await vi.waitFor(() => expect(element.querySelector("svg")).not.toBeNull());
		expect(element.querySelector("tp-callout")).toBeNull();
	});
	it("handles missing SVG, MathJax errors, and non-Error failures", async () => {
		render.mockResolvedValueOnce(undefined);
		const element = fixture("x");
		await vi.waitFor(() =>
			expect(element.querySelector("tp-callout")).not.toBeNull(),
		);
		render.mockImplementationOnce(async (root: HTMLElement) => {
			draw(root);
			root.querySelector("svg")?.setAttribute("data-mml-node", "merror");
		});
		element.value = "bad latex";
		await vi.waitFor(() => expect(render).toHaveBeenCalledTimes(2));
		expect(element.textContent).toContain("could not be rendered");
		render.mockRejectedValueOnce("failure");
		element.value = "another expression";
		await vi.waitFor(() =>
			expect(element.textContent).toContain("Unable to render"),
		);
		element.value = "x";
		await vi.waitFor(() => expect(element.querySelector("svg")).not.toBeNull());
	});
	it("does not commit stale source results or detached renders", async () => {
		let finish:
			| ((value: { ok: boolean; text: () => Promise<string> }) => void)
			| undefined;
		vi.stubGlobal(
			"fetch",
			vi.fn(
				() =>
					new Promise((resolve) => {
						finish = resolve;
					}),
			),
		);
		const element = fixture("x", 'src="/slow.txt"');
		await vi.waitFor(() => expect(finish).toBeDefined());
		element.src = "";
		element.value = "new";
		finish?.({ ok: true, text: async () => "stale" });
		await vi.waitFor(() =>
			expect(element.querySelector("svg")?.getAttribute("aria-label")).toBe(
				"new",
			),
		);
		let release: (() => void) | undefined;
		render.mockImplementationOnce(
			(root: HTMLElement) =>
				new Promise<void>((resolve) => {
					release = () => {
						draw(root);
						resolve();
					};
				}),
		);
		element.value = "detached";
		await vi.waitFor(() => expect(release).toBeDefined());
		element.remove();
		release?.();
		await settle();
		expect(element.querySelector("svg")?.getAttribute("aria-label")).toBe(
			"new",
		);
		element.value = "reconnected";
		document.body.append(element);
		await vi.waitFor(() =>
			expect(element.querySelector("svg")?.getAttribute("aria-label")).toBe(
				"reconnected",
			),
		);
	});
	it("ignores obsolete failures and clears MathJax tracking", async () => {
		const clear = vi.fn();
		vi.stubGlobal("MathJax", { typesetClear: clear });
		let reject: ((reason: Error) => void) | undefined;
		render.mockImplementationOnce(
			() =>
				new Promise((_resolve, fail) => {
					reject = fail;
				}),
		);
		const element = fixture("x");
		await vi.waitFor(() => expect(reject).toBeDefined());
		element.value = "y";
		reject?.(new Error("obsolete"));
		await vi.waitFor(() =>
			expect(element.querySelector("svg")?.getAttribute("aria-label")).toBe(
				"y",
			),
		);
		expect(element.querySelector("tp-callout")).toBeNull();
		expect(clear).toHaveBeenCalledTimes(2);
		element.value = "pending";
		element.remove();
		await settle();
		expect(render).toHaveBeenCalledTimes(2);
	});
});

it("retains formula sources when rendered notes are copied into lists or tooltips", async () => {
	const note = document.createElement("tp-note");
	const formula = document.createElement("tp-math");
	formula.textContent = String.raw`\dot{x}`;
	formula.label = "Velocity";
	note.append(formula);
	document.body.append(note);
	await vi.waitFor(() => expect(formula.querySelector("svg")).not.toBeNull());
	for (const tag of ["tp-tooltip", "li"]) {
		const copy = document.createElement(tag);
		copy.append(referenceContent(note));
		document.body.append(copy);
		await settle();
		expect(copy.querySelector("tp-math svg")?.getAttribute("aria-label")).toBe(
			"Velocity",
		);
		expect(
			copy
				.querySelector("[data-tp-math-source]")
				?.getAttribute("data-tp-math-source"),
		).toBe(String.raw`\dot{x}`);
	}
	expect(render).toHaveBeenCalledTimes(3);
});
