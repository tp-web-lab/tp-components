import { afterEach, expect, it, vi } from "vitest";
import { openViewerSource } from "../../test-helpers/viewer-source.js";
import "./asciidoc-viewer.js";

afterEach(() => document.body.replaceChildren());
it("renders editable AsciiDoc and its output", async () => {
	const element = document.createElement("tp-asciidoc-viewer");
	element.innerHTML = '<script type="tp/asciidoc">= Hello</script>';
	document.body.append(element);
	await openViewerSource(element);
	await vi.waitFor(() =>
		expect(element.querySelector("tp-code-editor")).not.toBeNull(),
	);
	expect(element.querySelector('[data-role="output"]')).not.toBeNull();
});

it("covers titled examples and every AsciiDoc output mode", async () => {
	const element = document.createElement("tp-asciidoc-viewer");
	element.innerHTML =
		'<script type="tp/asciidoc">.One\n====\nFirst\n====\n\n.Two\n====\nSecond\n====</script>';
	const api = element as unknown as {
		readInlineSource(): { label: string; source: string; context: undefined };
		extractExamples(value: {
			label: string;
			source: string;
			context: undefined;
		}): Array<{ label: string }>;
		createExternalContext(url: URL): undefined;
		renderOutput(
			source: string,
			mode: string,
			container: HTMLElement,
		): Promise<void>;
	};
	const source = api.readInlineSource();
	expect(api.extractExamples(source).map((item) => item.label)).toEqual([
		"One",
		"Two",
	]);
	expect(
		api.extractExamples({
			label: "Plain",
			source: "Plain",
			context: undefined,
		}),
	).toHaveLength(1);
	expect(
		api.extractExamples({
			label: "Broken",
			source: ".Title\n====\nUnclosed",
			context: undefined,
		}),
	).toHaveLength(1);
	expect(
		api.createExternalContext(new URL("https://example.test/a.adoc")),
	).toBeUndefined();
	for (const mode of ["render", "ast", "html"]) {
		const output = document.createElement("div");
		await api.renderOutput("= Heading", mode, output);
		expect(output.childElementCount).toBeGreaterThan(0);
	}
	const runtime = document.createElement("div");
	await api.renderOutput("[stem]\n++++\nx^2\n++++", "render", runtime);
	expect(runtime.querySelector("iframe")?.srcdoc).toContain("tp-asciidoc");
	element.innerHTML = "<template>Template source</template>";
	expect(api.readInlineSource().source).toContain("Template source");
	element.replaceChildren(document.createTextNode("Text source"));
	expect(api.readInlineSource().source).toBe("Text source");
});
