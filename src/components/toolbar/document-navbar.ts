import "../button/button.js";
import "../icon-button/icon-button.js";
import "../divider/divider.js";

const requests = new WeakMap<HTMLElement, AbortController>();

/** Render the optional navigation list before the toolbar's global commands. */
export async function updateDocumentNavbar(
	toolbar: HTMLElement | null,
	hrefs: string[],
	rewriteLinks?: (root: HTMLElement) => void,
): Promise<void> {
	if (!toolbar) return;
	requests.get(toolbar)?.abort();
	const request = new AbortController();
	requests.set(toolbar, request);
	for (const element of toolbar.querySelectorAll(
		"[data-document-navbar], [data-document-navbar-divider]",
	))
		element.remove();
	try {
		for (const href of hrefs) {
			const url = new URL(href, toolbar.ownerDocument.baseURI);
			const response = await fetch(url.href, { signal: request.signal });
			if (!response.ok) continue;
			const source = await response.text();
			if (request.signal.aborted || !toolbar.isConnected) return;
			// A development server may return its HTML shell with status 200 for
			// absent optional files. Do not pass that shell to a markup parser.
			if (
				response.headers
					.get("content-type")
					?.toLowerCase()
					.includes("text/html") &&
				/<(?:!doctype\s+html|html|head|body)\b/i.test(source) &&
				(/\.(md|markdown|adoc|asciidoc|rst|rest|tex|latex)$/i.test(
					url.pathname,
				) ||
					/<script\b[^>]+src=["'][^"']*(?:tp-loader|\/src\/)|<tp-(?:markup|markdown|asciidoc|restructuredtext|latex|html)-multi-pages\b/i.test(
						source,
					))
			)
				continue;
			let html = source;
			if (/\.(tex|latex)$/i.test(url.pathname)) {
				const { renderLatexToHtml } = await import("@tp/tp-latex");
				html = renderLatexToHtml(source);
			}
			if (/\.(md|markdown)$/i.test(url.pathname)) {
				const { renderMarkdownToHtml } = await import(
					"../markdown/markdown.js"
				);
				html = await renderMarkdownToHtml(source, url.pathname);
			} else if (/\.(adoc|asciidoc)$/i.test(url.pathname)) {
				const { renderAsciidocToHtml } = await import(
					"../asciidoc/asciidoc.js"
				);
				html = await renderAsciidocToHtml(source);
			} else if (/\.(rst|rest)$/i.test(url.pathname)) {
				const { renderRestructuredTextToHtml } = await import(
					"../restructuredtext/restructuredtext.js"
				);
				html = await renderRestructuredTextToHtml(source);
			}
			if (request.signal.aborted || !toolbar.isConnected) return;
			const container = document.createElement("div");
			container.innerHTML = html;
			const list = container.querySelector("ul, ol");
			if (!list) continue;
			const menu = document.createElement("div");
			const controls: HTMLElement[] = [];
			for (const item of list.querySelectorAll<HTMLElement>(
				"tp-button, tp-icon-button, a[href]",
			)) {
				if (item.parentElement?.closest("tp-button, tp-icon-button")) continue;
				let control = item;
				if (item.matches("a")) {
					control = document.createElement("tp-button");
					for (const attribute of item.attributes)
						control.setAttribute(attribute.name, attribute.value);
					control.append(...item.childNodes);
				}
				control.dataset.documentNavbar = "";
				control.setAttribute("section", "end");
				controls.push(control);
				menu.append(control);
			}
			if (!controls.length) continue;
			rewriteLinks?.(menu);
			for (const link of menu.querySelectorAll<HTMLElement>(
				"a[href], tp-button[href], tp-icon-button[href]",
			)) {
				if (link.matches("a") && link.closest("tp-button, tp-icon-button"))
					continue;
				const raw = link.getAttribute("href") ?? "";
				if (raw.startsWith("#")) continue;
				const target = new URL(raw, url);
				if (["http:", "https:", "mailto:", "tel:"].includes(target.protocol))
					link.setAttribute("href", target.href);
				else link.removeAttribute("href");
			}
			const divider = document.createElement("tp-divider");
			divider.dataset.documentNavbarDivider = "";
			divider.setAttribute("section", "end");
			divider.setAttribute("orientation", "vertical");
			const end = toolbar.querySelector("[data-toolbar-end]");
			if (end) end.prepend(...controls, divider);
			else toolbar.prepend(...controls, divider);
			return;
		}
	} catch {
		// Navigation is optional; missing files and cancelled requests add no controls.
	}
}
