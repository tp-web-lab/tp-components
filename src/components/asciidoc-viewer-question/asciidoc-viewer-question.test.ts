import { afterEach, expect, expectTypeOf, it, vi } from "vitest";
import type { TpAsciidocViewer } from "../asciidoc-viewer/asciidoc-viewer.js";
import type { TpMarkupViewerQuestion } from "../markup-viewer-question/markup-viewer-question.js";
import { TpAsciidocViewerQuestion } from "./asciidoc-viewer-question.js";

afterEach(() => {
	document.body.replaceChildren();
	vi.unstubAllGlobals();
});
it("creates only its fixed asciidoc viewer", async () => {
	vi.stubGlobal(
		"requestAnimationFrame",
		vi.fn(() => 0),
	);
	const question = new TpAsciidocViewerQuestion();
	expectTypeOf(question).toExtend<TpMarkupViewerQuestion<TpAsciidocViewer>>();
	question.innerHTML = "<dl><dt>Title</dt><dd>Exercise</dd></dl>";
	document.body.append(question);
	await Promise.resolve();
	expect(question.querySelector("tp-asciidoc-viewer")).not.toBeNull();
	expect(TpAsciidocViewerQuestion.observedAttributes).toContain("src");
	expect(TpAsciidocViewerQuestion.observedAttributes).toContain("test");
	expect(TpAsciidocViewerQuestion.observedAttributes).not.toContain("language");
	expect(TpAsciidocViewerQuestion.observedAttributes).not.toContain("mode");
	expect(customElements.get("tp-asciidoc-viewer-question")).toBe(
		TpAsciidocViewerQuestion,
	);
});
