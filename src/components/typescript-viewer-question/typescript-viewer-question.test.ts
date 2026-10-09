import { afterEach, expect, expectTypeOf, it, vi } from "vitest";
import type { TpPlaygroundQuestion } from "../playground-question/playground-question.js";
import type { TpTypescriptViewer } from "../typescript-viewer/typescript-viewer.js";
import { TpTypescriptViewerQuestion } from "./typescript-viewer-question.js";

afterEach(() => {
	document.body.replaceChildren();
	vi.unstubAllGlobals();
});
it("creates only its fixed typescript viewer", async () => {
	vi.stubGlobal(
		"requestAnimationFrame",
		vi.fn(() => 0),
	);
	const question = new TpTypescriptViewerQuestion();
	expectTypeOf(question).toExtend<TpPlaygroundQuestion<TpTypescriptViewer>>();
	question.innerHTML = "<dl><dt>Title</dt><dd>Exercise</dd></dl>";
	document.body.append(question);
	await Promise.resolve();
	expect(question.querySelector("tp-typescript-viewer")).not.toBeNull();
	expect(TpTypescriptViewerQuestion.observedAttributes).toContain("src");
	expect(TpTypescriptViewerQuestion.observedAttributes).toContain("test");
	expect(TpTypescriptViewerQuestion.observedAttributes).not.toContain(
		"language",
	);
	expect(TpTypescriptViewerQuestion.observedAttributes).not.toContain("mode");
	expect(customElements.get("tp-typescript-viewer-question")).toBe(
		TpTypescriptViewerQuestion,
	);
});
