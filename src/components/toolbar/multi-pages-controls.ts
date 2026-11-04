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
