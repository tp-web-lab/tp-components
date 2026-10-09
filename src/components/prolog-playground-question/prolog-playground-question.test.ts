import { afterEach, expect, expectTypeOf, it, vi } from "vitest";
import type { TpPlaygroundQuestion } from "../playground-question/playground-question.js";
import type { TpPrologPlayground } from "../prolog-playground/prolog-playground.js";
import { TpPrologPlaygroundQuestion } from "./prolog-playground-question.js";

afterEach(() => {
	document.body.replaceChildren();
	vi.unstubAllGlobals();
});
it("creates only its fixed prolog playground", async () => {
	vi.stubGlobal(
		"requestAnimationFrame",
		vi.fn(() => 0),
	);
	const question = new TpPrologPlaygroundQuestion();
	expectTypeOf(question).toExtend<TpPlaygroundQuestion<TpPrologPlayground>>();
	question.innerHTML = "<dl><dt>Title</dt><dd>Exercise</dd></dl>";
	document.body.append(question);
	await Promise.resolve();
	expect(question.querySelector("tp-prolog-playground")).not.toBeNull();
	expect(TpPrologPlaygroundQuestion.observedAttributes).toContain("src");
	expect(TpPrologPlaygroundQuestion.observedAttributes).toContain("test");
	expect(TpPrologPlaygroundQuestion.observedAttributes).not.toContain(
		"language",
	);
	expect(TpPrologPlaygroundQuestion.observedAttributes).not.toContain("mode");
	expect(customElements.get("tp-prolog-playground-question")).toBe(
		TpPrologPlaygroundQuestion,
	);
});
