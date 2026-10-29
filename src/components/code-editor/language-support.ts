import type { Extension } from "@codemirror/state";

const loaded = new Map<string, Extension>();
const pending = new Map<string, Promise<Extension>>();
const loaders: Record<string, () => Promise<Extension>> = {
	css: async () => (await import("@codemirror/lang-css")).css(),
	html: async () => (await import("@codemirror/lang-html")).html(),
	javascript: async () =>
		(await import("@codemirror/lang-javascript")).javascript(),
	typescript: async () =>
		(await import("@codemirror/lang-javascript")).javascript({
			typescript: true,
		}),
	json: async () => (await import("@codemirror/lang-json")).json(),
	markdown: async () => (await import("@codemirror/lang-markdown")).markdown(),
	python: async () => (await import("@codemirror/lang-python")).python(),
	sql: async () => (await import("@codemirror/lang-sql")).sql(),
};

export function getLoadedLanguageSupport(language: string): Extension {
	return loaded.get(language) ?? [];
}

/** Share language downloads; a failed download remains retryable. */
export function loadLanguageSupport(
	language: string,
): Promise<Extension> | null {
	const loader = Object.hasOwn(loaders, language)
		? loaders[language]
		: undefined;
	if (!loader || loaded.has(language)) return null;
	let request = pending.get(language);
	if (!request) {
		request = loader().then(
			(extension) => {
				loaded.set(language, extension);
				pending.delete(language);
				return extension;
			},
			(error) => {
				pending.delete(language);
				throw error;
			},
		);
		pending.set(language, request);
	}
	return request;
}
