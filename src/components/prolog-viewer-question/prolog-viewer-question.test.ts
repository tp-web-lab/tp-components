import { afterEach, expect, expectTypeOf, it, vi } from "vitest";
import type { TpPlaygroundQuestion } from "../playground-question/playground-question.js";
import type { TpPrologViewer } from "../prolog-viewer/prolog-viewer.js";
import { TpPrologViewerQuestion } from "./prolog-viewer-question.js";

afterEach(() => {
	document.body.replaceChildren();
	vi.unstubAllGlobals();
});
it("creates only its fixed prolog viewer", async () => {
	vi.stubGlobal(
		"requestAnimationFrame",
		vi.fn(() => 0),
	);
	const question = new TpPrologViewerQuestion();
	expectTypeOf(question).toExtend<TpPlaygroundQuestion<TpPrologViewer>>();
	question.innerHTML = "<dl><dt>Title</dt><dd>Exercise</dd></dl>";
	document.body.append(question);
	await Promise.resolve();
	expect(question.querySelector("tp-prolog-viewer")).not.toBeNull();
	expect(TpPrologViewerQuestion.observedAttributes).toContain("src");
	expect(TpPrologViewerQuestion.observedAttributes).toContain("test");
	expect(TpPrologViewerQuestion.observedAttributes).not.toContain("language");
	expect(TpPrologViewerQuestion.observedAttributes).not.toContain("mode");
	expect(customElements.get("tp-prolog-viewer-question")).toBe(
		TpPrologViewerQuestion,
	);
});
