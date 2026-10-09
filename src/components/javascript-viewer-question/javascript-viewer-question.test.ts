import { afterEach, expect, expectTypeOf, it, vi } from "vitest";
import type { TpJavascriptViewer } from "../javascript-viewer/javascript-viewer.js";
import type { TpPlaygroundQuestion } from "../playground-question/playground-question.js";
import { TpJavascriptViewerQuestion } from "./javascript-viewer-question.js";

afterEach(() => {
	document.body.replaceChildren();
	vi.unstubAllGlobals();
});
it("creates only its fixed javascript viewer", async () => {
	vi.stubGlobal(
		"requestAnimationFrame",
		vi.fn(() => 0),
	);
	const question = new TpJavascriptViewerQuestion();
	expectTypeOf(question).toExtend<TpPlaygroundQuestion<TpJavascriptViewer>>();
	question.innerHTML = "<dl><dt>Title</dt><dd>Exercise</dd></dl>";
	document.body.append(question);
	await Promise.resolve();
	expect(question.querySelector("tp-javascript-viewer")).not.toBeNull();
	expect(TpJavascriptViewerQuestion.observedAttributes).toContain("src");
	expect(TpJavascriptViewerQuestion.observedAttributes).toContain("test");
	expect(TpJavascriptViewerQuestion.observedAttributes).not.toContain(
		"language",
	);
	expect(TpJavascriptViewerQuestion.observedAttributes).not.toContain("mode");
	expect(customElements.get("tp-javascript-viewer-question")).toBe(
		TpJavascriptViewerQuestion,
	);
});
