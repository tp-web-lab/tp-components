import { afterEach, expect, expectTypeOf, it, vi } from "vitest";
import type { TpMarkdownViewer } from "../markdown-viewer/markdown-viewer.js";
import type { TpMarkupViewerQuestion } from "../markup-viewer-question/markup-viewer-question.js";
import { TpMarkdownViewerQuestion } from "./markdown-viewer-question.js";

afterEach(() => {
	document.body.replaceChildren();
	vi.unstubAllGlobals();
});
it("creates only its fixed markdown viewer", async () => {
	vi.stubGlobal(
		"requestAnimationFrame",
		vi.fn(() => 0),
	);
	const question = new TpMarkdownViewerQuestion();
	expectTypeOf(question).toExtend<TpMarkupViewerQuestion<TpMarkdownViewer>>();
	question.innerHTML = "<dl><dt>Title</dt><dd>Exercise</dd></dl>";
	document.body.append(question);
	await Promise.resolve();
	expect(question.querySelector("tp-markdown-viewer")).not.toBeNull();
	expect(TpMarkdownViewerQuestion.observedAttributes).toContain("src");
	expect(TpMarkdownViewerQuestion.observedAttributes).toContain("test");
	expect(TpMarkdownViewerQuestion.observedAttributes).not.toContain("language");
	expect(TpMarkdownViewerQuestion.observedAttributes).not.toContain("mode");
	expect(customElements.get("tp-markdown-viewer-question")).toBe(
		TpMarkdownViewerQuestion,
	);
});
