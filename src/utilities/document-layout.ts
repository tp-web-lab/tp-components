import iconStyle from "../components/icon/icon.css?inline";
import { getCodeFromScript } from "./code.js";
import previewStyle from "./document-layout.css?inline";

/** Reserve the intrinsic source height while the interactive editor loads. */
function prepareEditorPreview(editor: HTMLElement): boolean {
	if (
		editor.hasAttribute("toolbar") ||
		editor.hasAttribute("word-wrap") ||
		editor.hasAttribute("src")
	)
		return false;
	const source = getCodeFromScript(undefined, editor);
	if (!source) return false;
	if (!document.getElementById("tp-document-layout-styles")) {
		const style = document.createElement("style");
		style.id = "tp-document-layout-styles";
		style.textContent = previewStyle;
		document.head.append(style);
	}
	const preview = document.createElement("pre");
	preview.dataset.tpEditorPreview = "";
	preview.setAttribute("aria-label", "Code preview");
	preview.textContent = source.value.includes("\n")
		? source.value
		: `${source.value}\n `;
	editor.dataset.tpEditorPending = "";
	editor.append(preview);
	return true;
}

/**
 * Prepare components that establish the surrounding document's geometry before
 * publishing parsed markup. Leave optional viewers and language runtimes lazy.
 * Templates and script sources are inert and are not traversed by selectors.
 */
export async function prepareDocumentLayout(root: ParentNode): Promise<void> {
	const loads: Promise<unknown>[] = [];
	let initializeInlineEditors = false;
	const required = ["tp-toc", "tp-icon", "tp-iframe"].filter(
		(tag) => root.querySelector(tag) && !customElements.get(tag),
	);
	document.dispatchEvent(
		new CustomEvent("tp-document-preload", { detail: required }),
	);
	if (root.querySelector("tp-toc") && !customElements.get("tp-toc"))
		loads.push(import("../components/toc/toc.js"));
	if (root.querySelector("tp-icon") && !customElements.get("tp-icon")) {
		if (!document.getElementById("tp-document-icon-styles")) {
			const style = document.createElement("style");
			style.id = "tp-document-icon-styles";
			style.textContent = iconStyle;
			document.head.append(style);
		}
		for (const icon of root.querySelectorAll<HTMLElement>("tp-icon[size]")) {
			icon.style.setProperty(
				"--tp-icon-size",
				icon.getAttribute("size") ?? "1em",
			);
		}
		void import("../components/icon/icon.js").catch((error) =>
			console.warn("Unable to initialize document icons", error),
		);
	}
	if (!customElements.get("tp-code-editor")) {
		const editors = Array.from(
			root.querySelectorAll<HTMLElement>("tp-code-editor"),
		);
		const needsLayout = editors
			.map(prepareEditorPreview)
			.some((prepared) => !prepared);
		// Simple inline sources can paint immediately; complex layouts retain the safe path.
		if (editors.length > 0) {
			if (needsLayout)
				loads.push(import("../components/code-editor/code-editor.js"));
			else initializeInlineEditors = true;
		}
	}
	if (root.querySelector("tp-iframe") && !customElements.get("tp-iframe"))
		loads.push(import("../components/iframe/iframe.js"));
	await Promise.all(loads);
	// Publish and paint the readable source before downloading its interactive
	// replacement. Two frames allow the first frame to actually be presented.
	if (initializeInlineEditors)
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				void import("../components/code-editor/code-editor.js").catch((error) =>
					console.warn("Unable to initialize document editor", error),
				);
			});
		});
}
