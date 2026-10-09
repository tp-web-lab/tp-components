import { vi } from "vitest";

/** Supplies the MathJax 4 boundary without downloading a CDN script in jsdom. */
export function stubMathJaxRuntime() {
	const tex2svgPromise = vi.fn(
		async (source: string, _options?: { display?: boolean }) => {
			const container = document.createElement("mjx-container");
			container.dataset.testMathjax = source;
			container.append(
				document.createElementNS("http://www.w3.org/2000/svg", "svg"),
			);
			return container;
		},
	);
	const typesetPromise = vi.fn(async () => undefined);
	vi.stubGlobal("MathJax", {
		version: "4.0.0",
		startup: { promise: Promise.resolve() },
		tex2svgPromise,
		typesetPromise,
	});
	return { tex2svgPromise, typesetPromise };
}
