interface HighlightRuntime {
	getLanguage(name: string): unknown;
	highlight(
		source: string,
		options: { language: string; ignoreIllegals: boolean },
	): { value: string };
}
const runtimes = new WeakMap<Document, Promise<HighlightRuntime>>();

/** Colour language-tagged native code lazily, preserving literal text on failure. */
export async function highlightCodeBlocks(root: HTMLElement): Promise<void> {
	const blocks = [
		...root.querySelectorAll<HTMLElement>(
			'code[data-tp-latex-listing][class*="language-"], pre > code[class*="language-"]',
		),
	].filter(
		(code) =>
			!code.dataset.highlighted &&
			!code.classList.contains("hljs") &&
			!code.querySelector(".conum, a") &&
			!code.closest(".nohighlight, .no-highlight, .cm-editor"),
	);
	if (!blocks.length) return;
	const doc = root.ownerDocument;
	const runtime = doc.defaultView as
		| (Window & { hljs?: HighlightRuntime })
		| null;
	let loading = runtimes.get(doc);
	if (!loading) {
		loading = runtime?.hljs
			? Promise.resolve(runtime.hljs)
			: new Promise((resolve, reject) => {
					const script = doc.createElement("script");
					script.src =
						"https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.11.1/build/highlight.min.js";
					script.addEventListener(
						"load",
						() =>
							runtime?.hljs
								? resolve(runtime.hljs)
								: reject(new Error("Highlight.js unavailable")),
						{ once: true },
					);
					script.addEventListener(
						"error",
						() => reject(new Error("Highlight.js unavailable")),
						{ once: true },
					);
					doc.head.append(script);
				});
		runtimes.set(doc, loading);
	}
	try {
		const hljs = await loading;
		for (const code of blocks) {
			const language = [...code.classList]
				.find((name) => name.startsWith("language-"))
				?.slice(9);
			if (
				!language ||
				!hljs.getLanguage(language) ||
				code.dataset.highlighted ||
				code.querySelector(".conum, a")
			)
				continue;
			code.innerHTML = hljs.highlight(code.textContent ?? "", {
				language,
				ignoreIllegals: true,
			}).value;
			if (code.parentElement?.localName === "pre") code.classList.add("hljs");
			code.dataset.highlighted = "yes";
		}
	} catch {
		runtimes.delete(doc);
	}
}

export const highlightLatexListings = highlightCodeBlocks;
