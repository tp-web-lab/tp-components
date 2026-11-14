import { expect, it } from "vitest";
import {
	getCatalogLanguageFromFilename,
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

it("loads Haskell on demand and shares the grammar with its extension alias", async () => {
	const first = loadLanguageSupport("Haskell");
	expect(first).not.toBeNull();
	expect(loadLanguageSupport("hs")).toBe(first);
	const extension = await first;
	expect(getLoadedLanguageSupport("haskell")).toBe(extension);
	expect(getLoadedLanguageSupport("hs")).toBe(extension);
	expect(loadLanguageSupport("haskell")).toBeNull();
});

it.each(["rust", "go", "ruby", "shell", "yaml", "cpp"])(
	"loads the catalog grammar for %s",
	async (name) => {
		const request = loadLanguageSupport(name);
		expect(request).not.toBeNull();
		const extension = await request;
		expect(extension).toBeTruthy();
		expect(getLoadedLanguageSupport(name)).toBe(extension);
	},
);

it("preserves TP-specific modes", () => {
	for (const name of ["abc", "asciidoc", "prolog", "restructuredtext"]) {
		expect(loadLanguageSupport(name)).toBeNull();
		expect(getLoadedLanguageSupport(name)).toEqual([]);
	}
});

it("detects additional file types without loading their grammars", () => {
	expect(
		getCatalogLanguageFromFilename("/examples/quick-sort.hs?version=2#code"),
	).toBe("haskell");
	expect(getCatalogLanguageFromFilename("source.rs")).toBe("rust");
	expect(getCatalogLanguageFromFilename("source.unknown")).toBeUndefined();
});
