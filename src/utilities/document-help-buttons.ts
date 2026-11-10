/** Complete command inventory for multi-page documentation, independent of the current page. */
export function documentHelpButtons(host: HTMLElement): HTMLElement {
	const catalog = host.ownerDocument.createElement("section");
	const groups: Record<string, [string, string, string, string?][]> = {
		"Toolbar — left": [
			[
				"Logo",
				"Open the website associated with the document. Available when a logo is configured.",
				"icon",
				"components",
			],
			["Home", "Return to the introductory page from any chapter.", "home"],
			[
				"Menu",
				"Show or hide the table of contents used to choose a page.",
				"menu",
			],
			[
				"Code",
				"Display the source of the current page; click again to return to the rendered document.",
				"code",
			],
			[
				"Calculator",
				"Open or close the scientific calculator without leaving the page. Previous calculations are retained.",
				"calculator",
				"components",
			],
			[
				"Personal annotations",
				"Open your personal notes to add a note attached to a page element or find an existing annotation.",
				"post-it-editor",
				"components",
			],
			[
				"Source repository (git)",
				"Open the source repository configured for the document.",
				"source",
				"components",
			],
		],
		"Toolbar — right": [
			[
				"Language",
				"Switch to a translation of the documentation. Available when several languages are configured.",
				"lang",
				"components",
			],
			[
				"Color",
				"Choose the accent color used by document controls and highlighted elements.",
				"palette-swatch",
			],
			[
				"Theme",
				"Choose a light or dark appearance, or follow the system setting with the automatic theme.",
				"theme-light-dark",
			],
			[
				"Screen",
				"Preview the layout at a phone, tablet or desktop size; choose default to restore the available window size.",
				"screen",
				"components",
			],
			[
				"Fullscreen / Exit fullscreen",
				"Expand the document to fill the screen, or return to the normal window.",
				"fullscreen fullscreen-exit",
			],
		],
		"Table of contents": [
			[
				"Search table of contents",
				"Show or hide a title search field. Matches are highlighted without changing the current page.",
				"search",
			],
			[
				"Expand all",
				"Reveal every nested heading in the table of contents.",
				"arrow-expand-vertical",
			],
			[
				"Collapse all",
				"Fold every branch to show only the top-level entries.",
				"arrow-collapse-vertical",
			],
			[
				"Widen/Restore width",
				"Widen the sidebar to read long titles; click again to restore its previous width.",
				"arrow-expand-horizontal arrow-collapse-horizontal",
			],
			[
				"Expand/Collapse branch",
				"Reveal or hide the child entries of this heading without changing the current page.",
				"plus-box-outline minus-box-outline",
			],
		],
		"Bottom of page": [
			[
				"Previous page",
				"Open the preceding page in the table of contents. Unavailable on the first page.",
				"previous",
			],
			["Top of page", "Scroll to the top of the current page.", "top"],
			[
				"Next page",
				"Open the following page in the table of contents. Unavailable on the last page.",
				"next",
			],
		],
	};
	for (const [group, entries] of Object.entries(groups)) {
		for (const [label, description, icons, library] of entries) {
			const entry = host.ownerDocument.createElement("span");
			entry.dataset.helpLabel = label;
			entry.dataset.helpDescription = description;
			entry.dataset.helpIcons = icons;
			entry.dataset.helpGroup = group;
			const icon = host.ownerDocument.createElement("tp-icon");
			icon.setAttribute("name", icons.split(" ")[0] ?? "");
			if (library) icon.setAttribute("library", library);
			entry.append(icon);
			catalog.append(entry);
		}
	}
	return catalog;
}
