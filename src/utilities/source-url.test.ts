import { describe, expect, it } from "vitest";
import {
	getComponentSourceBaseUrl,
	resolveComponentSourceUrl,
} from "./source-url.js";

describe("component source URLs in isolated previews", () => {
	/** Creates an independent document, as used by Attributes previews. */
	function createPreview(): { document: Document; component: HTMLElement } {
		const preview = document.implementation.createHTMLDocument();
		const base = preview.createElement("base");
		base.href =
			"https://example.test/docs/components/python-playground/examples/";
		preview.head.append(base);
		const component = preview.createElement("tp-python-playground");
		preview.body.append(component);
		return { document: preview, component };
	}

	it("resolves relative resources against the owning document's base", () => {
		const { component } = createPreview();
		expect(getComponentSourceBaseUrl(component)).toBe(
			component.ownerDocument.baseURI,
		);
		expect(resolveComponentSourceUrl(component, "file1.json").href).toBe(
			"https://example.test/docs/components/python-playground/examples/file1.json",
		);
		expect(
			resolveComponentSourceUrl(component, "/projects/file2.json").href,
		).toBe("https://example.test/projects/file2.json");
	});

	it("preserves Markdown and explicit source precedence in the owning document", () => {
		const { document: preview, component } = createPreview();
		preview.body.setAttribute("data-tp-markdown-source", "../index.md");
		expect(resolveComponentSourceUrl(component, "file1.json").href).toBe(
			"https://example.test/docs/components/python-playground/file1.json",
		);
		component.setAttribute("data-tp-source", "custom/page.html");
		expect(resolveComponentSourceUrl(component, "file1.json").href).toBe(
			"https://example.test/docs/components/python-playground/custom/file1.json",
		);
	});

	it("resolves resources against nested Markdown rather than the outer published page", () => {
		const { document: preview, component } = createPreview();
		preview.body.setAttribute("data-tp-source", "/derivatives/docs/slope.md");
		preview.body.setAttribute(
			"data-tp-markdown-source",
			"/derivatives/docs/slope.md",
		);
		const nested = preview.createElement("tp-markdown");
		nested.setAttribute(
			"data-tp-markdown-source",
			"/derivatives/docs/examples/slope.solution.md",
		);
		preview.body.append(nested);
		nested.append(component);
		expect(resolveComponentSourceUrl(component, "slope.py").href).toBe(
			"https://example.test/derivatives/docs/examples/slope.py",
		);
		component.setAttribute("data-tp-source", "custom/page.html");
		expect(resolveComponentSourceUrl(component, "slope.py").href).toBe(
			"https://example.test/derivatives/docs/examples/custom/slope.py",
		);
	});
});
