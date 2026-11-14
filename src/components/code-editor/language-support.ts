import { LanguageDescription } from "@codemirror/language";
import { languages } from "@codemirror/language-data";
import type { Extension } from "@codemirror/state";
import { styleTags, tags } from "@lezer/highlight";

const loaded = new Map<string, Extension>();
const pending = new Map<string, Promise<Extension>>();
async function latexSupport(): Promise<Extension> {
	const [{ StreamLanguage }, { stex }] = await Promise.all([
		import("@codemirror/language"),
		import("@codemirror/legacy-modes/mode/stex"),
	]);
	return StreamLanguage.define(stex);
}
const loaders: Record<string, () => Promise<Extension>> = {
	latex: latexSupport,
	stex: latexSupport,
	css: async () => (await import("@codemirror/lang-css")).css(),
	html: async () => (await import("@codemirror/lang-html")).html(),
	javascript: async () =>
		(await import("@codemirror/lang-javascript")).javascript(),
	typescript: async () =>
		(await import("@codemirror/lang-javascript")).javascript({
			typescript: true,
		}),
	json: async () => (await import("@codemirror/lang-json")).json(),
	markdown: async () =>
		(await import("@codemirror/lang-markdown")).markdown({
			extensions: [
				{ props: [styleTags({ ListMark: tags.special(tags.list) })] },
			],
		}),
	python: async () => (await import("@codemirror/lang-python")).python(),
	sql: async () => (await import("@codemirror/lang-sql")).sql(),
};

// These modes are supplied directly by tp-code-editor; never replace them
// with a generic catalog grammar. Plain text intentionally has no grammar.
const localLanguages = new Set([
	"abc",
	"asciidoc",
	"prolog",
	"restructuredtext",
	"plaintext",
	"text",
	"txt",
]);

function resolveLanguage(language: string): {
	key: string;
	load: () => Promise<Extension>;
} | null {
	const name = language.trim().toLowerCase();
	if (localLanguages.has(name)) return null;
	if (Object.hasOwn(loaders, name)) {
		const load = loaders[name];
		if (load) return { key: name, load };
	}
	const description =
		LanguageDescription.matchLanguageName(languages, name, false) ??
		languages.find((entry) => entry.extensions.includes(name));
	if (!description) return null;
	const key = description.name.toLowerCase();
	if (localLanguages.has(key)) return null;
	const preferred = Object.hasOwn(loaders, key) ? loaders[key] : undefined;
	return { key, load: preferred ?? (() => description.load()) };
}

export function getLoadedLanguageSupport(language: string): Extension {
	const resolved = resolveLanguage(language);
	return resolved ? (loaded.get(resolved.key) ?? []) : [];
}

/** Share concurrent loads (including aliases); failures remain retryable. */
export function loadLanguageSupport(
	language: string,
): Promise<Extension> | null {
	const resolved = resolveLanguage(language);
	if (!resolved || loaded.has(resolved.key)) return null;
	const { key, load } = resolved;
	let request = pending.get(key);
	if (!request) {
		request = load().then(
			(extension) => {
				loaded.set(key, extension);
				pending.delete(key);
				return extension;
			},
			(error) => {
				pending.delete(key);
				throw error;
			},
		);
		pending.set(key, request);
	}
	return request;
}

/** Complements TP's source-language detection with the catalog's file patterns. */
export function getCatalogLanguageFromFilename(
	filename: string,
): string | undefined {
	const path = filename.split(/[?#]/, 1)[0] ?? filename;
	return LanguageDescription.matchFilename(languages, path)?.name.toLowerCase();
}
