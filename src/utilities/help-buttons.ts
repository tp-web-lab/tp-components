/** Builds a noninteractive legend from the component's currently available controls. */
export function createHelpButtonTable(
	host: HTMLElement,
	instructions: string,
): HTMLElement | null {
	const doc = host.ownerDocument;
	// Layout wrappers contain commands owned by the surrounding component.
	const layoutHosts = new Set([
		"tp-button-group",
		"tp-toolbar",
		"tp-cluster",
		"tp-stack",
		"tp-inline",
		"tp-grid",
		"tp-box",
		"tp-center",
		"tp-sidebar",
		"tp-splitter",
	]);
	const selector = 'button, [role="button"], tp-icon-button, tp-button';
	const controls = [
		...(host.matches(selector) ? [host] : []),
		...host.querySelectorAll<HTMLElement>(
			'button, [role="button"], tp-icon-button, tp-button',
		),
	];
	const rows = instructions
		.split("\n")
		.filter((line) => line.startsWith("|"))
		.map((line) =>
			line
				.split("|")
				.slice(1, -1)
				.map((cell) =>
					cell.replace(/:tp-icon:\{[^}]*\}|<[^>]*>|[*`]/g, "").trim(),
				),
		);
	const normalize = (label: string) =>
		label
			.toLowerCase()
			.replace(/[^\p{L}\p{N}]+/gu, " ")
			.trim();
	const section = doc.createElement("section");
	section.className = "tp-component-help-buttons tp-markdown-output";
	const groups = new Map<string, HTMLTableSectionElement>();
	const seen = new Set<string>();
	const groupBody = (name: string) => {
		const existing = groups.get(name);
		if (existing) return existing;
		const heading = doc.createElement("h4");
		heading.textContent = name;
		const table = doc.createElement("table");
		table.className = "tp-md-table";
		const head = table.createTHead().insertRow();
		for (const label of ["Button", "Description"]) {
			const cell = doc.createElement("th");
			cell.scope = "col";
			cell.textContent = label;
			head.append(cell);
		}
		const body = table.createTBody();
		groups.set(name, body);
		section.append(heading, table);
		return body;
	};
	for (const control of controls) {
		if (
			control.namespaceURI !== "http://www.w3.org/1999/xhtml" ||
			control.localName === "dt"
		)
			continue;
		// Only inspect ancestors within this component: documentation containers outside
		// it must never hide its controls from the legend.
		let excluded = false;
		for (
			let parent: HTMLElement | null = control;
			parent && parent !== host;
			parent = parent.parentElement
		) {
			if (
				parent.matches(
					'[hidden], [aria-hidden="true"], [data-help-ignore], [data-role="content"], .tp-component-help',
				) ||
				(parent !== control &&
					(parent.matches(selector) ||
						(parent.localName.startsWith("tp-") &&
							!layoutHosts.has(parent.localName))))
			) {
				excluded = true;
				break;
			}
		}
		if (control !== host && host.matches(selector)) excluded = true;
		if (excluded) continue;
		const native = control.querySelector("button, [role=button]");
		const label =
			control.getAttribute("label") ||
			control.getAttribute("aria-label") ||
			native?.getAttribute("aria-label") ||
			control.getAttribute("title") ||
			control.textContent?.trim();
		if (!label) continue;
		const icon = control.matches("tp-icon-button")
			? control
			: control.querySelector("tp-icon");
		const name = icon?.getAttribute("name") ?? "";
		const library = icon?.getAttribute("library") ?? "";
		const groupHost = control.closest(
			"[data-help-group], tp-button-group[aria-label], [role=toolbar][aria-label]",
		);
		const group =
			groupHost && host.contains(groupHost)
				? groupHost.getAttribute("data-help-group") ||
					groupHost.getAttribute("aria-label") ||
					"Buttons"
				: "Buttons";
		const identity = `${group}|${label}|${name}|${library}`;
		if (seen.has(identity)) continue;
		seen.add(identity);
		const row = groupBody(group).insertRow();
		const button = row.insertCell();
		if (name) {
			const glyph = doc.createElement("tp-icon");
			glyph.setAttribute("name", name);
			if (library) glyph.setAttribute("library", library);
			glyph.setAttribute("aria-hidden", "true");
			glyph.setAttribute("size", "2em");
			button.append(glyph, " ");
		}
		button.append(doc.createTextNode(label));
		const shortLabel = label
			.replace(
				new RegExp(
					`^${host.localName.replace(/^tp-/, "").replace(/-/g, " ")} `,
					"i",
				),
				"",
			)
			.replace(/ selected piece/g, "");
		const matched =
			rows.find(([name]) => normalize(name ?? "") === normalize(label)) ??
			rows.find(([name]) =>
				(name ?? "")
					.split(" / ")
					.some(
						(part) =>
							normalize(part.split(" (")[0] ?? "") === normalize(shortLabel),
					),
			);
		row.insertCell().textContent =
			control.getAttribute("data-help-description") ||
			control.getAttribute("aria-description") ||
			matched?.[1]?.split(/(?<=[.!?])\s/)[0] ||
			control.getAttribute("title") ||
			label;
	}
	if (!groups.size) return null;
	return section;
}
