/**
 * @module tp-loader
 * @summary Charge automatiquement les composants `tp-*` réellement présents dans le DOM.
 */

import { ensureTpBaseStyles } from "./components/base/base-styles.js";
import {
	collectTpComponentTags,
	importTpComponent,
} from "./utilities/component-imports.js";

// Replaced from the production bundle graph; development keeps normal imports.
const preloadManifest = "__TP_DOCUMENT_PRELOADS__";
const documentPreloads: Record<string, string[]> = preloadManifest.startsWith(
	"{",
)
	? JSON.parse(preloadManifest)
	: {};
const preloadedUrls = new Set<string>();

function preloadDocument(tagName: string): void {
	const loaderUrl = new URL(import.meta.url);
	const root = new URL(
		loaderUrl.pathname.includes("/chunks/") ? "../" : "./",
		loaderUrl,
	);
	for (const file of documentPreloads[tagName] ?? []) {
		const href = new URL(file, root).href;
		if (preloadedUrls.has(href)) continue;
		preloadedUrls.add(href);
		const link = document.createElement("link");
		link.rel = "modulepreload";
		link.href = href;
		document.head.append(link);
	}
}

// Detached parsed documents can announce required components before they enter the DOM.
if (typeof document !== "undefined") {
	document.addEventListener("tp-document-preload", (event) => {
		for (const tag of (event as CustomEvent<string[]>).detail)
			preloadDocument(tag);
	});
}

let loaderObserver: MutationObserver | null = null;

export async function loadUsedTpComponents(
	root: ParentNode = document,
): Promise<void> {
	const tagNames = collectTpComponentTags(root);
	// The document URL already identifies its renderer; load it alongside the page shell.
	const pages = Array.from(root.querySelectorAll("tp-markup-single-page[src]"));
	if (root instanceof Element && root.matches("tp-markup-single-page[src]"))
		pages.push(root);
	for (const page of pages) {
		const path = (page.getAttribute("src") ?? "")
			.split(/[?#]/)[0]
			?.toLowerCase();
		if (path?.endsWith(".md")) tagNames.add("tp-markdown");
	}
	for (const tagName of tagNames) preloadDocument(tagName);
	await Promise.all([...tagNames].map((tagName) => importTpComponent(tagName)));
}

function getObserverTarget(root: ParentNode): Node {
	if (root instanceof Document) {
		return root.documentElement ?? root;
	}

	return root as Node;
}

export function observeUsedTpComponents(
	root: ParentNode = document,
): MutationObserver {
	const observer = new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			for (const node of mutation.addedNodes) {
				if (node instanceof Element) {
					void loadUsedTpComponents(node);
				}
			}
		}
	});

	observer.observe(getObserverTarget(root), {
		childList: true,
		subtree: true,
	});

	return observer;
}

export async function startTpLoader(): Promise<void> {
	ensureTpBaseStyles();
	if (loaderObserver === null) {
		loaderObserver = observeUsedTpComponents(document);
	}
	await loadUsedTpComponents(document);
}

if (typeof document !== "undefined") {
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", () => {
			void startTpLoader();
		});
	} else {
		void startTpLoader();
	}
}
