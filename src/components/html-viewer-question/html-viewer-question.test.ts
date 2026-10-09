import { afterEach, expect, expectTypeOf, it, vi } from "vitest";
import type { TpHtmlViewer } from "../html-viewer/html-viewer.js";
import type { TpMarkupViewerQuestion } from "../markup-viewer-question/markup-viewer-question.js";
import { TpHtmlViewerQuestion } from "./html-viewer-question.js";

afterEach(() => {
	document.body.replaceChildren();
	vi.unstubAllGlobals();
});
it("creates only its fixed html viewer", async () => {
	vi.stubGlobal(
		"requestAnimationFrame",
		vi.fn(() => 0),
	);
	const question = new TpHtmlViewerQuestion();
	expectTypeOf(question).toExtend<TpMarkupViewerQuestion<TpHtmlViewer>>();
	question.innerHTML = "<dl><dt>Title</dt><dd>Exercise</dd></dl>";
	document.body.append(question);
	await Promise.resolve();
	expect(question.querySelector("tp-html-viewer")).not.toBeNull();
	expect(TpHtmlViewerQuestion.observedAttributes).toContain("src");
	expect(TpHtmlViewerQuestion.observedAttributes).toContain("test");
	expect(TpHtmlViewerQuestion.observedAttributes).not.toContain("language");
	expect(TpHtmlViewerQuestion.observedAttributes).not.toContain("mode");
	expect(customElements.get("tp-html-viewer-question")).toBe(
		TpHtmlViewerQuestion,
	);
});
