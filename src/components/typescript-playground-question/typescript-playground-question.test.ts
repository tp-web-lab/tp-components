import { afterEach, expect, expectTypeOf, it, vi } from "vitest";
import type { TpPlaygroundQuestion } from "../playground-question/playground-question.js";
import type { TpTypescriptPlayground } from "../typescript-playground/typescript-playground.js";
import { TpTypescriptPlaygroundQuestion } from "./typescript-playground-question.js";

afterEach(() => {
	document.body.replaceChildren();
	vi.unstubAllGlobals();
});
it("creates only its fixed typescript playground", async () => {
	vi.stubGlobal(
		"requestAnimationFrame",
		vi.fn(() => 0),
	);
	const question = new TpTypescriptPlaygroundQuestion();
	expectTypeOf(question).toExtend<
		TpPlaygroundQuestion<TpTypescriptPlayground>
	>();
	question.innerHTML = "<dl><dt>Title</dt><dd>Exercise</dd></dl>";
	document.body.append(question);
	await Promise.resolve();
	expect(question.querySelector("tp-typescript-playground")).not.toBeNull();
	expect(TpTypescriptPlaygroundQuestion.observedAttributes).toContain("src");
	expect(TpTypescriptPlaygroundQuestion.observedAttributes).toContain("test");
	expect(TpTypescriptPlaygroundQuestion.observedAttributes).not.toContain(
		"language",
	);
	expect(TpTypescriptPlaygroundQuestion.observedAttributes).not.toContain(
		"mode",
	);
	expect(customElements.get("tp-typescript-playground-question")).toBe(
		TpTypescriptPlaygroundQuestion,
	);
});
