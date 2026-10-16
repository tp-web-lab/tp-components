import "../textfield/textfield.js";
import type { TpTree } from "../tree/tree.js";

/** Shared navigation tools for both multi-page implementations. */
export function appendSidebarTools(controls: HTMLElement, tree: TpTree): void {
	const button = (name: string, label: string) => {
		const element = document.createElement("tp-icon-button");
		element.name = name;
		element.setAttribute("label", label);
		element.setAttribute("title", label);
		controls.append(element);
		return element;
	};
	let originalPosition: string | null = null;
	const widthButton = button(
		"arrow-expand-horizontal",
		"Widen table of contents",
	);
	widthButton.setAttribute("aria-pressed", "false");
	widthButton.addEventListener("click", () => {
		const sidebar = tree.closest<HTMLElement>('[data-role="sidebar"]');
		const splitter = sidebar?.closest("tp-splitter");
		if (!sidebar || !splitter) return;
		if (originalPosition !== null) {
			splitter.position = originalPosition;
			originalPosition = null;
			sidebar.removeAttribute("data-tp-sidebar-wide");
			sidebar.style.removeProperty("--tp-sidebar-expanded-width");
		} else {
			originalPosition = splitter.position;
			// Measure every title, including collapsed descendants, without changing the live tree.
			const clone = tree.cloneNode(true) as TpTree;
			clone.setAttribute("aria-hidden", "true");
			clone.setAttribute("inert", "");
			clone.style.cssText =
				"position:fixed;inset-inline-start:-100000px;visibility:hidden;inline-size:max-content;max-inline-size:none;white-space:nowrap";
			for (const node of clone.querySelectorAll("[id]"))
				node.removeAttribute("id");
			for (const item of clone.querySelectorAll("li"))
				item.setAttribute("data-expanded", "true");
			sidebar.append(clone);
			clone.expandAll();
			const needed = Math.ceil(clone.getBoundingClientRect().width + 48);
			clone.remove();
			const total = splitter.getBoundingClientRect().width;
			const current = sidebar.getBoundingClientRect().width;
			if (total > 0)
				splitter.position = `${Math.min(90, (Math.max(current, needed) / total) * 100)}%`;
			sidebar.style.setProperty("--tp-sidebar-expanded-width", `${needed}px`);
			sidebar.setAttribute("data-tp-sidebar-wide", "");
		}
		const expanded = originalPosition !== null;
		widthButton.name = expanded
			? "arrow-collapse-horizontal"
			: "arrow-expand-horizontal";
		const label = expanded
			? "Restore table of contents width"
			: "Widen table of contents";
		widthButton.setAttribute("label", label);
		widthButton.setAttribute("title", label);
		widthButton.setAttribute("aria-pressed", String(expanded));
	});
	const searchButton = button("search", "Search table of contents");
	controls.prepend(searchButton);
	searchButton.setAttribute("aria-expanded", "false");
	const search = document.createElement("div");
	search.setAttribute("data-tp-sidebar-search", "");
	search.hidden = true;
	const field = document.createElement("tp-textfield");
	field.setAttribute("label", "Search table of contents");
	field.setAttribute("clearable", "");
	const status = document.createElement("span");
	status.setAttribute("role", "status");
	search.append(field, status);
	controls.append(search);
	const normalize = (value: string) =>
		value.normalize("NFD").replace(/\p{M}/gu, "").toLocaleLowerCase().trim();
	let matches: HTMLElement[] = [];
	let active = -1;
	const reveal = () => {
		const match = matches[active];
		const sidebar = tree.closest<HTMLElement>('[data-role="sidebar"]');
		if (!match || !sidebar) return;
		// Scroll only the navigation panel and leave room for its sticky search controls.
		const top =
			sidebar.scrollTop +
			match.getBoundingClientRect().top -
			sidebar.getBoundingClientRect().top -
			controls.getBoundingClientRect().height -
			12;
		sidebar.scrollTop = Math.max(0, top);
	};
	const update = () => {
		const query = normalize(field.value);
		matches = [];
		for (const row of tree.querySelectorAll<HTMLElement>(
			"[data-tp-tree-row]",
		)) {
			const copy = row.cloneNode(true) as HTMLElement;
			copy.querySelector("[data-tp-tree-toggle]")?.remove();
			const matched =
				query !== "" && normalize(copy.textContent ?? "").includes(query);
			row.toggleAttribute("data-tp-sidebar-match", matched);
			if (!matched) continue;
			matches.push(row);
			let parent = row.closest("li")?.parentElement?.closest("li");
			while (parent && tree.contains(parent)) {
				tree.expandNode(parent);
				parent = parent.parentElement?.closest("li");
			}
		}
		active = matches.length ? 0 : -1;
		status.textContent = query
			? `${matches.length} result${matches.length === 1 ? "" : "s"}`
			: "";
		status.toggleAttribute(
			"data-tp-sidebar-no-results",
			query !== "" && matches.length === 0,
		);
		reveal();
	};
	field.addEventListener("input", update);
	searchButton.addEventListener("click", () => {
		search.hidden = !search.hidden;
		searchButton.setAttribute("aria-expanded", String(!search.hidden));
		if (search.hidden) {
			field.value = "";
			update();
		} else field.querySelector("input")?.focus();
	});
	field.addEventListener("keydown", (event) => {
		if (event.key === "Escape") {
			event.preventDefault();
			search.hidden = true;
			field.value = "";
			update();
			searchButton.setAttribute("aria-expanded", "false");
			searchButton.querySelector("button")?.focus();
		} else if (event.key === "Enter" && matches.length) {
			event.preventDefault();
			active = (active + 1) % matches.length;
			reveal();
		}
	});
}
