import baseStyle from "./base.css?inline";
import resetStyle from "./tp-reset.css?inline";
import tokenStyle from "./tp-tokens.css?inline";

function preservesDocumentStyles(targetDocument: Document): boolean {
	return targetDocument.documentElement.hasAttribute(
		"data-tp-preserve-document-styles",
	);
}

/**
 * Injects the shared tp-* styles and a default theme class eagerly.
 *
 * This avoids initial render flashes when static markup uses theme-dependent
 * tokens before any `<tp-theme>` or `<tp-color>` interaction occurs.
 *
 * @summary Ensures global tp-* styles are ready.
 * @internal
 */
export function ensureTpBaseStyles(): void {
	if (typeof document === "undefined") {
		return;
	}

	// Copy controls do not gate style installation or the document loader.
	const targetDocument = document;
	void import("../../utilities/code-block-copy.js")
		.then(({ ensureCodeBlockCopyButtons }) =>
			ensureCodeBlockCopyButtons(targetDocument),
		)
		.catch((error) =>
			console.warn("Unable to initialize code copy controls", error),
		);
	injectGlobalStyle("tp-token-styles", tokenStyle);
	if (preservesDocumentStyles(document)) {
		return;
	}
	injectGlobalStyle("tp-reset-styles", resetStyle);
	injectGlobalStyle("tp-base-styles", baseStyle);

	if (typeof window === "undefined") {
		return;
	}

	const body = document.body;
	if (!(body instanceof HTMLElement)) {
		return;
	}

	if (
		body.classList.contains("tp-light") ||
		body.classList.contains("tp-dark")
	) {
		return;
	}

	const prefersDark =
		window.matchMedia?.("(prefers-color-scheme: dark)").matches === true;
	body.classList.add(prefersDark ? "tp-dark" : "tp-light");
}

/**
 * Injects a global stylesheet into `document.head` if needed.
 *
 * @summary Inserts a shared stylesheet once.
 * @param styleId Unique id of the style tag.
 * @param cssText CSS text to inject.
 * @internal
 */
function injectGlobalStyle(styleId: string, cssText: string): void {
	if (document.getElementById(styleId)) {
		return;
	}

	const styleEl = document.createElement("style");
	styleEl.id = styleId;
	styleEl.textContent = cssText;
	document.head.append(styleEl);
}
