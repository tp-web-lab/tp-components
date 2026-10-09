import { afterEach, expect, expectTypeOf, it, vi } from "vitest";
import type { TpPlaygroundQuestion } from "../playground-question/playground-question.js";
import type { TpPythonPlayground } from "../python-playground/python-playground.js";
import { TpPythonPlaygroundQuestion } from "./python-playground-question.js";

afterEach(() => {
	document.body.replaceChildren();
	vi.unstubAllGlobals();
});
it("creates only its fixed python playground", async () => {
	vi.stubGlobal(
		"requestAnimationFrame",
		vi.fn(() => 0),
	);
	const question = new TpPythonPlaygroundQuestion();
	expectTypeOf(question).toExtend<TpPlaygroundQuestion<TpPythonPlayground>>();
	question.innerHTML = "<dl><dt>Title</dt><dd>Exercise</dd></dl>";
	document.body.append(question);
	await Promise.resolve();
	expect(question.querySelector("tp-python-playground")).not.toBeNull();
	expect(TpPythonPlaygroundQuestion.observedAttributes).toContain("src");
	expect(TpPythonPlaygroundQuestion.observedAttributes).toContain("test");
	expect(TpPythonPlaygroundQuestion.observedAttributes).not.toContain(
		"language",
	);
	expect(TpPythonPlaygroundQuestion.observedAttributes).not.toContain("mode");
	expect(customElements.get("tp-python-playground-question")).toBe(
		TpPythonPlaygroundQuestion,
	);
});
