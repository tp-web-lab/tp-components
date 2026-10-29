import { expect, it } from "vitest";
import {
	getLoadedLanguageSupport,
	loadLanguageSupport,
} from "./language-support.js";

it("shares concurrent language loads and reuses the installed extension", async () => {
	const first = loadLanguageSupport("javascript");
	expect(first).not.toBeNull();
	expect(loadLanguageSupport("javascript")).toBe(first);
	const extension = await first;
	expect(getLoadedLanguageSupport("javascript")).toBe(extension);
	expect(loadLanguageSupport("javascript")).toBeNull();
});

it("does not load grammars for plain text or unknown language names", () => {
	for (const language of ["plaintext", "unknown", "constructor", "__proto__"]) {
		expect(loadLanguageSupport(language)).toBeNull();
		expect(getLoadedLanguageSupport(language)).toEqual([]);
	}
});
