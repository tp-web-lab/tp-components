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
