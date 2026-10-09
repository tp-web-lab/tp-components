import { afterEach, expect, expectTypeOf, it, vi } from "vitest";
import type { TpPlaygroundQuestion } from "../playground-question/playground-question.js";
import type { TpPythonViewer } from "../python-viewer/python-viewer.js";
import { TpPythonViewerQuestion } from "./python-viewer-question.js";

afterEach(() => {
	document.body.replaceChildren();
	vi.unstubAllGlobals();
});
it("creates only its fixed python viewer", async () => {
	vi.stubGlobal(
		"requestAnimationFrame",
		vi.fn(() => 0),
	);
	const question = new TpPythonViewerQuestion();
	expectTypeOf(question).toExtend<TpPlaygroundQuestion<TpPythonViewer>>();
	question.innerHTML = "<dl><dt>Title</dt><dd>Exercise</dd></dl>";
	document.body.append(question);
	await Promise.resolve();
	expect(question.querySelector("tp-python-viewer")).not.toBeNull();
	expect(TpPythonViewerQuestion.observedAttributes).toContain("src");
	expect(TpPythonViewerQuestion.observedAttributes).toContain("test");
	expect(TpPythonViewerQuestion.observedAttributes).not.toContain("language");
	expect(TpPythonViewerQuestion.observedAttributes).not.toContain("mode");
	expect(customElements.get("tp-python-viewer-question")).toBe(
		TpPythonViewerQuestion,
	);
});
