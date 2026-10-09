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
});
