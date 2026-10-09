import { afterEach, expect, expectTypeOf, it, vi } from "vitest";
import type { TpMarkupViewerQuestion } from "../markup-viewer-question/markup-viewer-question.js";
import type { TpRestructuredTextViewer } from "../restructuredtext-viewer/restructuredtext-viewer.js";
import { TpRestructuredTextViewerQuestion } from "./restructuredtext-viewer-question.js";

afterEach(() => {
	document.body.replaceChildren();
	vi.unstubAllGlobals();
});
it("creates only its fixed restructuredtext viewer", async () => {
	vi.stubGlobal(
		"requestAnimationFrame",
		vi.fn(() => 0),
	);
	const question = new TpRestructuredTextViewerQuestion();
	expectTypeOf(question).toExtend<
		TpMarkupViewerQuestion<TpRestructuredTextViewer>
	>();
	question.innerHTML = "<dl><dt>Title</dt><dd>Exercise</dd></dl>";
	document.body.append(question);
	await Promise.resolve();
	expect(question.querySelector("tp-restructuredtext-viewer")).not.toBeNull();
	expect(TpRestructuredTextViewerQuestion.observedAttributes).toContain("src");
	expect(TpRestructuredTextViewerQuestion.observedAttributes).toContain("test");
	expect(TpRestructuredTextViewerQuestion.observedAttributes).not.toContain(
		"language",
	);
	expect(TpRestructuredTextViewerQuestion.observedAttributes).not.toContain(
		"mode",
	);
	expect(customElements.get("tp-restructuredtext-viewer-question")).toBe(
		TpRestructuredTextViewerQuestion,
	);
});
