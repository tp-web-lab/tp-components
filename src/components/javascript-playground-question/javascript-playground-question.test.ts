import { afterEach, expect, expectTypeOf, it, vi } from "vitest";
import type { TpJavascriptPlayground } from "../javascript-playground/javascript-playground.js";
import type { TpPlaygroundQuestion } from "../playground-question/playground-question.js";
import { TpJavascriptPlaygroundQuestion } from "./javascript-playground-question.js";

afterEach(() => {
	document.body.replaceChildren();
	vi.unstubAllGlobals();
});
it("creates only its fixed javascript playground", async () => {
	vi.stubGlobal(
		"requestAnimationFrame",
		vi.fn(() => 0),
	);
	const question = new TpJavascriptPlaygroundQuestion();
	expectTypeOf(question).toExtend<
		TpPlaygroundQuestion<TpJavascriptPlayground>
	>();
	question.innerHTML = "<dl><dt>Title</dt><dd>Exercise</dd></dl>";
	document.body.append(question);
	await Promise.resolve();
	expect(question.querySelector("tp-javascript-playground")).not.toBeNull();
	expect(TpJavascriptPlaygroundQuestion.observedAttributes).toContain("src");
	expect(TpJavascriptPlaygroundQuestion.observedAttributes).toContain("test");
	expect(TpJavascriptPlaygroundQuestion.observedAttributes).not.toContain(
		"language",
	);
	expect(TpJavascriptPlaygroundQuestion.observedAttributes).not.toContain(
		"mode",
	);
	expect(customElements.get("tp-javascript-playground-question")).toBe(
		TpJavascriptPlaygroundQuestion,
	);
});
