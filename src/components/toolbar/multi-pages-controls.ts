/** Select document toolbar commands without rebuilding the current page. */
export function updateMultiPagesToolbar(host: HTMLElement): void {
	const toolbar = host.querySelector("tp-toolbar");
	if (!toolbar) return;
	const value = host.getAttribute("toolbar")?.trim() ?? "";
	const selected = value
		? new Set(value.split(",").map((name) => name.trim().toLowerCase()))
		: null;
	const selectors: Record<string, string> = {
		home: '[data-action="home"]',
		menu: '[data-action="menu"]',
		code: '[data-action="code"]',
		calc: '[data-action="calculator"]',
		postit: "tp-post-it-editor[section]",
		clock: "tp-clock[section]",
		lang: "tp-lang[section]",
		color: "tp-color[section]",
		theme: "tp-theme[section]",
		screen: "tp-screen[section]",
		fullscreen: "tp-fullscreen[section]",
	};
	const languages = new Set(
		(host.getAttribute("langs") ?? "")
			.split(",")
			.map((lang) => lang.trim().toLowerCase())
			.filter(Boolean),
	);
	for (const [name, selector] of Object.entries(selectors)) {
		const control = toolbar.querySelector<HTMLElement>(selector);
		if (control)
			control.hidden =
				(selected !== null && !selected.has(name)) ||
				(name === "lang" && languages.size < 2);
	}
	const descriptions: Record<string, [string, string]> = {
		'[data-action="home"]': [
			"Home",
			"Return to the first page of the documentation from any chapter.",
		],
		'[data-action="menu"]': [
			"Menu",
			"Show or hide the table of contents used to choose a page.",
		],
		'[data-action="code"]': [
			"Code",
			"Display the source of the current page; click again to return to the rendered document.",
		],
		'[data-action="calculator"]': [
			"Calculator",
			"Open or close the scientific calculator without leaving the current page. Previous calculations are retained.",
		],
		"tp-post-it-editor[section]": [
			"Personal annotations",
			"Open your personal notes to add a note attached to a page element or find an existing annotation.",
		],
		"tp-source[section]": ["Source repository", "Open the source repository."],
		"tp-lang[section]": [
			"Language",
			"Switch to the selected translation of the documentation.",
		],
		"tp-color[section]": [
			"Color",
			"Choose the accent color used by the document controls and highlighted elements.",
		],
		"tp-theme[section]": [
			"Theme",
			"Choose a light or dark appearance, or follow the system setting with the automatic theme.",
		],
		"tp-screen[section]": [
			"Screen",
			"Preview the layout at a phone, tablet or desktop screen size; choose default to restore the available window size.",
		],
		"tp-fullscreen[section]": [
			"Fullscreen",
			"Expand the document to fill the screen, or return to the normal window.",
		],
	};
	for (const [selector, [label, description]] of Object.entries(descriptions)) {
		const control = toolbar.querySelector<HTMLElement>(selector);
		if (!control) continue;
		control.dataset.helpLabel = label;
		control.dataset.helpDescription = description;
		control.dataset.helpGroup =
			control.getAttribute("section") === "start"
				? "Toolbar — left"
				: "Toolbar — right";
	}
}

/** Close the general menu initially in portrait and on each transition to portrait. */
export function observeMultiPagesOrientation(host: HTMLElement): () => void {
	const view = host.ownerDocument.defaultView;
	if (!view) return () => {};
	let portrait = false;
	const update = (): void => {
		const next = view.innerHeight > view.innerWidth;
		if (next && !portrait) host.removeAttribute("menu");
		portrait = next;
	};
	update();
	view.addEventListener("resize", update);
	return () => view.removeEventListener("resize", update);
}
