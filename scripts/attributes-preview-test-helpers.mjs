/** @module scripts/attributes-preview-test-helpers */

/**
 * Provides a jsdom object-URL stub that tracks preview documents and revoked URLs.
 *
 * Import this helper from a Node.js ES module; it is not a standalone command. Pass an existing
 * jsdom window before initializing the preview code.
 *
 * @example
 * import { trackPreviewDocuments } from "./scripts/attributes-preview-test-helpers.mjs";
 * const preview = trackPreviewDocuments(dom.window);
 */

import { Blob } from "node:buffer";

/** Emulates object URLs while keeping their documents readable in jsdom. */
export function trackPreviewDocuments(window) {
	const documents = new Map();
	const revoked = [];
	let nextId = 0;
	window.Blob = Blob;
	window.URL.createObjectURL = (blob) => {
		const url = `blob:https://example.test/preview-${++nextId}`;
		documents.set(url, blob);
		return url;
	};
	window.URL.revokeObjectURL = (url) => {
		revoked.push(url);
		documents.delete(url);
	};
	return {
		documents,
		revoked,
		read: () =>
			documents.get(window.document.querySelector("tp-iframe").src).text(),
	};
}
