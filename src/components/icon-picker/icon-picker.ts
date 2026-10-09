/**
 * @module components/icon-picker
 * @summary Icon picker that lists built-in icons from `icon-internal`
 *          and SVG libraries stored in `src/components/icon/icons/`.
 */

// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-icon
 * @summary SVG icon component with inline, URL, and registry sources.
 */
/**
 * @tp-dependency tp-radio-list
 * @summary Transforms a list into a group of radio buttons.
 */
// tp-docgen:dependencies:end

import { TpBase } from "../base/base.js";
import { tpInternalIcons } from "../icon/icon-internal.js";
import style from "./icon-picker.css?inline";
import "../icon/icon.js";
import "../radio-list/radio-list.js";

/**
 * Raw SVG files discovered under `src/components/icon/icons/`.
 *
 * @summary Eagerly loaded icon library files from the icon directories.
 * @internal
 */
const directoryIconModules = import.meta.glob(
	"/src/components/icon/icons/**/*.svg",
	{
		query: "?raw",
		import: "default",
		eager: true,
	},
) as Record<string, string>;

/**
 * One icon row rendered by the picker.
 *
 * @summary Serializable icon metadata used by the picker UI.
 * @internal
 */
type TpIconPickerItem = {
	id: string;
	name: string;
	library: string;
	sourcePath: string;
	svg: string;
};

/**
 * Clipboard output generated when an icon is selected.
 *
 * @summary Supported icon picker copy formats.
 */
export type TpIconPickerCopyFormat =
	| "name"
	| "svg"
	| "tp-icon"
	| "tp-icon-button"
	| "img";

const copyFormats = new Set<TpIconPickerCopyFormat>([
	"name",
	"svg",
	"tp-icon",
	"tp-icon-button",
	"img",
]);

const copyFormatValues: TpIconPickerCopyFormat[] = [
	"name",
	"svg",
	"tp-icon",
	"tp-icon-button",
	"img",
];

function isCopyFormat(value: string): value is TpIconPickerCopyFormat {
	return copyFormats.has(value as TpIconPickerCopyFormat);
}

function escapeHtmlAttribute(value: string): string {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll('"', "&quot;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;");
}

/**
 * Parsed metadata extracted from an icon file path.
 *
 * @summary Parsed icon path information.
 * @internal
 */
type ParsedDirectoryIconPath = {
	library: string;
	name: string;
};

type TpIconPickerIconOptions = {
	size: string;
	color: string;
	scale: string;
	rotate: string;
	flipH: boolean;
	flipV: boolean;
	spin: boolean;
};

/**
 * Creates a safe prefix for generated SVG IDs.
 *
 * @summary Converts arbitrary identifiers into a safe SVG ID prefix.
 * @param value Source identifier.
 * @returns Normalized ID-safe prefix.
 * @internal
 */
function toSvgIdPrefix(value: string): string {
	return value.replace(/[^a-zA-Z0-9_-]+/g, "-");
}

/**
 * Namespaces SVG IDs and URL references to avoid cross-icon collisions.
 *
 * Flags and other complex SVGs can contain shared IDs such as `a`/`b`.
 * When many icons are rendered in the same document, those IDs conflict.
 *
 * @summary Rewrites inline SVG IDs and references with a unique prefix.
 * @param svg Raw SVG markup.
 * @param prefix Prefix to prepend to every internal SVG ID.
 * @returns SVG markup with namespaced IDs and references.
 * @internal
 */
function namespaceSvgIds(svg: string, prefix: string): string {
	const template = document.createElement("template");
	template.innerHTML = svg;
	const root = template.content.firstElementChild;
	if (!(root instanceof SVGElement)) {
		return svg;
	}

	const idMap = new Map<string, string>();
	const elementsWithId = root.querySelectorAll<HTMLElement | SVGElement>(
		"[id]",
	);
	for (const element of elementsWithId) {
		const currentId = element.getAttribute("id");
		if (currentId === null || currentId === "") {
			continue;
		}

		const nextId = `${prefix}-${currentId}`;
		idMap.set(currentId, nextId);
		element.setAttribute("id", nextId);
	}

	if (idMap.size === 0) {
		return root.outerHTML;
	}

	const allElements = root.querySelectorAll<HTMLElement | SVGElement>("*");
	for (const element of allElements) {
		for (const attribute of Array.from(element.attributes)) {
			let value = attribute.value;

			if (value.startsWith("#")) {
				const key = value.slice(1);
				const mapped = idMap.get(key);
				if (mapped !== undefined) {
					value = `#${mapped}`;
				}
			}

			value = value.replace(/url\(#([^)]+)\)/g, (_full, idRef: string) => {
				const mapped = idMap.get(idRef);
				return mapped === undefined ? `url(#${idRef})` : `url(#${mapped})`;
			});

			if (value !== attribute.value) {
				element.setAttribute(attribute.name, value);
			}
		}
	}

	return root.outerHTML;
}

/**
 * Parses `/src/components/icon/icons/<library>/<name>.svg` paths.
 *
 * @summary Extracts library and icon names from a directory icon path.
 * @param filePath Absolute Vite glob path.
 * @returns Parsed path metadata, or `null` when the path does not match.
 * @internal
 */
function parseDirectoryIconPath(
	filePath: string,
): ParsedDirectoryIconPath | null {
	const match = filePath.match(
		/^\/src\/components\/icon\/icons\/([^/]+)\/(.+)\.svg$/i,
	);
	if (match === null) {
		return null;
	}

	const library = match[1];
	const fileName = match[2];
	if (library === undefined || fileName === undefined) {
		return null;
	}

	const name =
		library === "flags" && fileName.startsWith("cif-")
			? fileName.slice("cif-".length)
			: fileName;

	return {
		library,
		name,
	};
}

/**
 * Collects internal icons declared in `icon-internal.ts`.
 *
 * @summary Builds picker items from the internal icon registry source.
 * @returns Sorted internal icon picker items.
 * @internal
 */
function collectInternalIconItems(): TpIconPickerItem[] {
	return Object.entries(tpInternalIcons)
		.map(([name, svg]) => ({
			id: `tp:${name}`,
			name,
			library: "tp",
			sourcePath: "src/components/icon/icon-internal.ts",
			svg,
		}))
		.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Collects icons discovered in `src/components/icon/icons/`.
 *
 * @summary Builds picker items from directory-based icon libraries.
 * @returns Sorted directory icon picker items.
 * @internal
 */
function collectDirectoryIconItems(): TpIconPickerItem[] {
	const items: TpIconPickerItem[] = [];

	for (const [filePath, svg] of Object.entries(directoryIconModules)) {
		const parsed = parseDirectoryIconPath(filePath);
		if (parsed === null) {
			continue;
		}

		items.push({
			id: `${parsed.library}:${parsed.name}`,
			name: parsed.name,
			library: parsed.library,
			sourcePath: filePath,
			svg,
		});
	}

	return items.sort((a, b) => {
		const libraryComparison = a.library.localeCompare(b.library);
		if (libraryComparison !== 0) {
			return libraryComparison;
		}

		return a.name.localeCompare(b.name);
	});
}

/**
 * Builds the complete icon list used by the picker.
 *
 * @summary Returns all available icon metadata from internal and directory sources.
 * @returns Consolidated and sorted icon list.
 * @internal
 */
function collectIconPickerItems(): TpIconPickerItem[] {
	return [...collectInternalIconItems(), ...collectDirectoryIconItems()].sort(
		(a, b) => {
			const libraryComparison = a.library.localeCompare(b.library);
			if (libraryComparison !== 0) {
				return libraryComparison;
			}

			return a.name.localeCompare(b.name);
		},
	);
}

/**
 * `<tp-icon-picker>` lists predefined icons and lets users pick one.
 *
 * The component stays in Light DOM and dispatches `tp-icon-picker-select`
 * when an item is clicked. Clicking also copies the representation selected
 * with `copy` to the clipboard when the Clipboard API is available.
 *
 * @summary Picker for predefined icons.
 * @tagname tp-icon-picker
 * @attr {string} filter = "" - Free-text filter applied to icon names/libraries.
 * @attr {string} library = "all" - Active library filter (`all` by default).
 * @attr {'name'|'svg'|'tp-icon'|'tp-icon-button'|'img'} copy = "name" - Clipboard output format (`name` by default).
 * @attr {boolean} compact = false - Shows only the title, filters, and a compact 2em icon grid.
 * @event tp-icon-picker-select Emitted after an icon is selected.
 * @event tp-icon-picker-copy-error Emitted when the clipboard rejects a copy operation.
 * @example
 * <tp-icon-picker></tp-icon-picker>
 */
export class TpIconPicker extends TpBase {
	/**
	 * Identifier used for the injected component stylesheet.
	 *
	 * @summary Global style identifier for the picker component.
	 * @internal
	 */
	private static readonly styleId = "tp-icon-picker-styles";
	private static nextSearchInputId = 0;

	/**
	 * All known icon entries rendered by the picker.
	 *
	 * @summary In-memory list of available icon entries.
	 * @internal
	 */
	private readonly items: TpIconPickerItem[] = collectIconPickerItems();

	/**
	 * Input field used for the text filter.
	 *
	 * @summary Search input element.
	 * @internal
	 */
	private searchInput: HTMLInputElement | null = null;

	/**
	 * Select field used for library filtering.
	 *
	 * @summary Library filter element.
	 * @internal
	 */
	private librarySelect: HTMLSelectElement | null = null;

	/**
	 * Grid container that holds icon item buttons.
	 *
	 * @summary Icon grid container.
	 * @internal
	 */
	private gridElement: HTMLElement | null = null;

	/**
	 * Label displaying the current result count.
	 *
	 * @summary Result count label.
	 * @internal
	 */
	private countElement: HTMLElement | null = null;

	/**
	 * Embedded radio list used to choose the clipboard output format.
	 *
	 * @summary Copy format selector.
	 * @internal
	 */
	private copyFormatElement: HTMLElement | null = null;

	/**
	 * Read-only field showing the exact clipboard value for the active icon.
	 *
	 * @summary Clipboard preview field.
	 * @internal
	 */
	private copyPreviewElement: HTMLTextAreaElement | null = null;

	/**
	 * Icon currently represented in the clipboard preview.
	 *
	 * @summary Active preview icon.
	 * @internal
	 */
	private activeItem: TpIconPickerItem | null = null;

	/**
	 * Last icon explicitly selected by clicking a grid item.
	 *
	 * @summary Clicked icon shown in the large preview.
	 * @internal
	 */
	private selectedItem: TpIconPickerItem | null = null;

	/**
	 * Large preview container for the clicked icon.
	 *
	 * @summary Selected icon preview.
	 * @internal
	 */
	private selectedPreviewElement: HTMLElement | null = null;
	private compactSelectedIconElement: HTMLElement | null = null;

	/**
	 * Stable `<tp-icon>` instance used exclusively by the selected preview.
	 *
	 * @summary Selected icon component.
	 * @internal
	 */
	private selectedIconElement: HTMLElement | null = null;

	/**
	 * Inputs controlling attributes added to copied `<tp-icon>` markup.
	 *
	 * @summary Icon attribute controls.
	 * @internal
	 */
	private iconOptionInputs: Record<string, HTMLInputElement> = {};

	/**
	 * Returns the list of observed attributes.
	 *
	 * @summary Declares attributes observed by the icon picker.
	 */
	public static get observedAttributes(): string[] {
		return ["filter", "library", "copy"];
	}

	public get compact(): boolean {
		return this.getBooleanAttribute("compact");
	}

	public set compact(value: boolean) {
		this.setBooleanAttribute("compact", value);
	}

	/**
	 * Returns the current text filter.
	 *
	 * @summary Returns the configured icon text filter.
	 */
	public get filter(): string {
		return this.getStringAttribute("filter", "");
	}

	/**
	 * Updates the current text filter.
	 *
	 * @summary Sets the icon text filter.
	 * @param value Filter text to apply.
	 */
	public set filter(value: string) {
		this.setStringAttribute("filter", value.trim());
	}

	/**
	 * Returns the active library filter.
	 *
	 * @summary Returns the configured library filter.
	 */
	public get library(): string {
		return this.getStringAttribute("library", "all");
	}

	/**
	 * Updates the active library filter.
	 *
	 * @summary Sets the active library filter.
	 * @param value Library name to apply (`all` for no restriction).
	 */
	public set library(value: string) {
		this.setStringAttribute(
			"library",
			value.trim() === "" ? "all" : value.trim(),
		);
	}

	/**
	 * Returns the clipboard output format.
	 *
	 * @summary Returns the configured copy format.
	 */
	public get copy(): TpIconPickerCopyFormat {
		const value = this.getStringAttribute("copy", "name");
		return isCopyFormat(value) ? value : "name";
	}

	/**
	 * Updates the clipboard output format.
	 *
	 * @summary Sets the copy format.
	 * @param value Clipboard output format.
	 */
	public set copy(value: TpIconPickerCopyFormat) {
		this.setStringAttribute("copy", value);
	}

	/**
	 * Connects the component and renders the picker UI.
	 *
	 * @summary Initializes the icon picker component.
	 */
	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle(TpIconPicker.styleId, style);
		this.ensureStructure();
		this.render();
	}

	/**
	 * Reacts to observed attribute changes.
	 *
	 * @summary Handles filter and library updates.
	 * @param name Updated attribute name.
	 * @param oldValue Previous value.
	 * @param newValue New value.
	 */
	protected override attributeChangedCallback(
		name: string,
		oldValue: string | null,
		newValue: string | null,
	): void {
		if (oldValue === newValue) {
			return;
		}

		if (name !== "filter" && name !== "library" && name !== "copy") {
			return;
		}

		if (this.isConnected) {
			if (name === "copy") {
				this.syncCopyControls();
			} else {
				this.render();
			}
		}
	}

	/**
	 * Ensures the static Light-DOM structure exists.
	 *
	 * @summary Creates picker controls and grid containers.
	 * @internal
	 */
	private ensureStructure(): void {
		let heading = this.queryElement<HTMLElement>(
			":scope > [data-tp-icon-picker-heading]",
		);
		if (!(heading instanceof HTMLElement)) {
			heading = document.createElement("div");
			heading.setAttribute("data-tp-icon-picker-heading", "");
			const title = document.createElement("strong");
			title.textContent = "Icon picker";
			const compactSelected = document.createElement("span");
			compactSelected.setAttribute("data-tp-icon-picker-compact-selected", "");
			compactSelected.setAttribute("role", "img");
			compactSelected.setAttribute("aria-label", "Selected icon");
			heading.append(title, compactSelected);
			this.prepend(heading);
		}
		this.compactSelectedIconElement = heading.querySelector<HTMLElement>(
			"[data-tp-icon-picker-compact-selected]",
		);

		let controls = this.queryElement<HTMLElement>(
			":scope > [data-tp-icon-picker-controls]",
		);
		if (!(controls instanceof HTMLElement)) {
			controls = document.createElement("div");
			controls.setAttribute("data-tp-icon-picker-controls", "");
			this.append(controls);
		}

		let searchLabel = controls.querySelector<HTMLLabelElement>(
			"label[data-tp-icon-picker-search-label]",
		);
		if (!(searchLabel instanceof HTMLLabelElement)) {
			searchLabel = document.createElement("label");
			searchLabel.setAttribute("data-tp-icon-picker-search-label", "");
			searchLabel.textContent = "Filter";
			controls.append(searchLabel);
		}

		let searchInput = controls.querySelector<HTMLInputElement>(
			"input[data-tp-icon-picker-search]",
		);
		if (!(searchInput instanceof HTMLInputElement)) {
			searchInput = document.createElement("input");
			searchInput.type = "search";
			searchInput.setAttribute("data-tp-icon-picker-search", "");
			searchInput.setAttribute("placeholder", "Filter icons");
			controls.append(searchInput);
		}
		if (searchInput.id.trim() === "") {
			TpIconPicker.nextSearchInputId += 1;
			searchInput.id = `tp-icon-picker-search-${String(TpIconPicker.nextSearchInputId)}`;
		}
		searchLabel.htmlFor = searchInput.id;

		let searchField = controls.querySelector<HTMLElement>(
			'[data-tp-icon-picker-field="filter"]',
		);
		if (!(searchField instanceof HTMLElement)) {
			searchField = document.createElement("div");
			searchField.setAttribute("data-tp-icon-picker-field", "filter");
			controls.prepend(searchField);
		}
		searchField.append(searchLabel, searchInput);

		searchInput.removeEventListener("input", this.onSearchInput);
		searchInput.addEventListener("input", this.onSearchInput);
		this.searchInput = searchInput;

		let librarySelect = controls.querySelector<HTMLSelectElement>(
			"select[data-tp-icon-picker-library]",
		);
		if (!(librarySelect instanceof HTMLSelectElement)) {
			librarySelect = document.createElement("select");
			librarySelect.setAttribute("data-tp-icon-picker-library", "");
			controls.append(librarySelect);
		}

		if (librarySelect.id.trim() === "") {
			librarySelect.id = `${searchInput.id}-library`;
		}
		let libraryLabel = controls.querySelector<HTMLLabelElement>(
			"label[data-tp-icon-picker-library-label]",
		);
		if (!(libraryLabel instanceof HTMLLabelElement)) {
			libraryLabel = document.createElement("label");
			libraryLabel.setAttribute("data-tp-icon-picker-library-label", "");
			libraryLabel.textContent = "Library";
		}
		libraryLabel.htmlFor = librarySelect.id;
		let libraryField = controls.querySelector<HTMLElement>(
			'[data-tp-icon-picker-field="library"]',
		);
		if (!(libraryField instanceof HTMLElement)) {
			libraryField = document.createElement("div");
			libraryField.setAttribute("data-tp-icon-picker-field", "library");
			controls.append(libraryField);
		}
		libraryField.append(libraryLabel, librarySelect);

		librarySelect.removeEventListener("change", this.onLibraryChange);
		librarySelect.addEventListener("change", this.onLibraryChange);
		this.librarySelect = librarySelect;

		let copyControls = this.queryElement<HTMLElement>(
			":scope > [data-tp-icon-picker-copy-controls]",
		);
		if (!(copyControls instanceof HTMLFieldSetElement)) {
			copyControls = document.createElement("fieldset");
			copyControls.setAttribute("data-tp-icon-picker-copy-controls", "");

			const legend = document.createElement("legend");
			legend.textContent = "Copy as";

			const radioList = document.createElement("tp-radio-list");
			radioList.setAttribute("data-tp-icon-picker-copy-format", "");
			radioList.setAttribute("name", `tp-icon-picker-copy-${searchInput.id}`);
			radioList.setAttribute("orientation", "horizontal");
			radioList.innerHTML = `
        <ul>
          <li>Icon name</li>
          <li>SVG code</li>
          <li>tp-icon HTML</li>
          <li>tp-icon-button HTML</li>
          <li>img HTML</li>
        </ul>
      `;

			copyControls.append(legend, radioList);
			this.append(copyControls);
		}

		const copyFormat = copyControls.querySelector<HTMLElement>(
			"[data-tp-icon-picker-copy-format]",
		);
		if (copyFormat instanceof HTMLElement) {
			copyFormat.removeEventListener(
				"tp-radio-list-change",
				this.onCopyFormatChange,
			);
			copyFormat.addEventListener(
				"tp-radio-list-change",
				this.onCopyFormatChange,
			);
			this.copyFormatElement = copyFormat;
		}

		let previewLabel = this.queryElement<HTMLLabelElement>(
			":scope > label[data-tp-icon-picker-copy-preview-label]",
		);
		let copyPreview = this.queryElement<HTMLTextAreaElement>(
			":scope > textarea[data-tp-icon-picker-copy-preview]",
		);
		if (!(copyPreview instanceof HTMLTextAreaElement)) {
			copyPreview = document.createElement("textarea");
			copyPreview.setAttribute("data-tp-icon-picker-copy-preview", "");
			copyPreview.readOnly = true;
			copyPreview.rows = 3;
			copyPreview.spellcheck = false;
			copyPreview.setAttribute("aria-live", "polite");
			copyPreview.id = `${searchInput.id}-copy-preview`;
			this.append(copyPreview);
		}
		if (!(previewLabel instanceof HTMLLabelElement)) {
			previewLabel = document.createElement("label");
			previewLabel.setAttribute("data-tp-icon-picker-copy-preview-label", "");
			previewLabel.textContent = "Content copied for the selected icon";
			this.insertBefore(previewLabel, copyPreview);
		}
		previewLabel.htmlFor = copyPreview.id;
		this.copyPreviewElement = copyPreview;

		this.ensureIconOptionControls(searchInput.id);
		this.ensureSelectedPreview(searchInput.id);
		this.syncCopyControls();

		let count = this.queryElement<HTMLElement>(
			":scope > [data-tp-icon-picker-count]",
		);
		if (!(count instanceof HTMLElement)) {
			count = document.createElement("p");
			count.setAttribute("data-tp-icon-picker-count", "");
			this.append(count);
		}
		this.countElement = count;

		let grid = this.queryElement<HTMLElement>(
			":scope > [data-tp-icon-picker-grid]",
		);
		if (!(grid instanceof HTMLElement)) {
			grid = document.createElement("div");
			grid.setAttribute("data-tp-icon-picker-grid", "");
			this.append(grid);
		}
		this.gridElement = grid;
	}

	/**
	 * Handles text filter input changes.
	 *
	 * @summary Applies typed search text as component filter.
	 * @internal
	 */
	private readonly onSearchInput = (): void => {
		if (!(this.searchInput instanceof HTMLInputElement)) {
			return;
		}

		this.filter = this.searchInput.value;
	};

	/**
	 * Handles library select changes.
	 *
	 * @summary Applies selected library as component filter.
	 * @internal
	 */
	private readonly onLibraryChange = (): void => {
		if (!(this.librarySelect instanceof HTMLSelectElement)) {
			return;
		}

		this.library = this.librarySelect.value;
	};

	/**
	 * Handles changes from the embedded copy format radio list.
	 *
	 * @summary Applies the selected clipboard format.
	 * @param event Radio-list change event.
	 * @internal
	 */
	private readonly onCopyFormatChange = (event: Event): void => {
		const value =
			(event as CustomEvent<{ value?: string }>).detail?.value ?? "1";
		this.copy = copyFormatValues[Number(value) - 1] ?? "name";
	};

	/**
	 * Creates inputs for optional `<tp-icon>` presentation attributes.
	 *
	 * @summary Builds icon attribute controls.
	 * @param idPrefix Unique prefix shared with picker controls.
	 * @internal
	 */
	private ensureIconOptionControls(idPrefix: string): void {
		let fieldset = this.queryElement<HTMLFieldSetElement>(
			":scope > fieldset[data-tp-icon-picker-icon-options]",
		);
		if (!(fieldset instanceof HTMLFieldSetElement)) {
			fieldset = document.createElement("fieldset");
			fieldset.setAttribute("data-tp-icon-picker-icon-options", "");

			const legend = document.createElement("legend");
			legend.textContent = "Icon attributes";
			fieldset.append(legend);

			const definitions: Array<{
				name: string;
				label: string;
				type: "text" | "number" | "checkbox";
				value?: string;
				placeholder?: string;
				step?: string;
			}> = [
				{
					name: "size",
					label: "Size",
					type: "text",
					value: "1em",
					placeholder: "e.g. 2em",
				},
				{
					name: "color",
					label: "Color",
					type: "text",
					value: "currentColor",
					placeholder: "e.g. red",
				},
				{
					name: "scale",
					label: "Scale",
					type: "number",
					value: "1",
					placeholder: "e.g. 1.5",
					step: "0.1",
				},
				{
					name: "rotate",
					label: "Rotate",
					type: "text",
					value: "0deg",
					placeholder: "e.g. 45deg",
				},
				{ name: "flip-h", label: "Flip horizontally", type: "checkbox" },
				{ name: "flip-v", label: "Flip vertically", type: "checkbox" },
				{ name: "spin", label: "Spin", type: "checkbox" },
			];

			for (const definition of definitions) {
				const label = document.createElement("label");
				label.setAttribute("data-tp-icon-picker-option-label", "");

				const input = document.createElement("input");
				input.type = definition.type;
				input.id = `${idPrefix}-${definition.name}`;
				input.dataset.tpIconPickerOption = definition.name;
				if (definition.value !== undefined) input.value = definition.value;
				if (definition.placeholder !== undefined)
					input.placeholder = definition.placeholder;
				if (definition.step !== undefined) input.step = definition.step;
				if (definition.name === "scale") input.min = "0.1";

				const text = document.createElement("span");
				text.textContent = definition.label;
				label.append(input, text);
				fieldset.append(label);
			}

			this.insertBefore(
				fieldset,
				this.querySelector("[data-tp-icon-picker-copy-preview-label]"),
			);
		}

		this.iconOptionInputs = {};
		for (const input of fieldset.querySelectorAll<HTMLInputElement>(
			"input[data-tp-icon-picker-option]",
		)) {
			const name = input.dataset.tpIconPickerOption;
			if (name === undefined) continue;
			this.iconOptionInputs[name] = input;
			input.removeEventListener("input", this.onIconOptionInput);
			input.addEventListener("input", this.onIconOptionInput);
			input.removeEventListener("change", this.onIconOptionInput);
			input.addEventListener("change", this.onIconOptionInput);
		}
	}

	/**
	 * Creates the large preview used for the clicked icon.
	 *
	 * @summary Builds selected icon visualization.
	 * @internal
	 */
	private ensureSelectedPreview(idPrefix: string): void {
		let figure = this.queryElement<HTMLElement>(
			":scope > figure[data-tp-icon-picker-selected]",
		);
		if (!(figure instanceof HTMLElement)) {
			figure = document.createElement("figure");
			figure.setAttribute("data-tp-icon-picker-selected", "");

			const title = document.createElement("strong");
			title.textContent = "Selected icon";

			const preview = document.createElement("span");
			preview.setAttribute("data-tp-icon-picker-selected-preview", "");

			const placeholder = document.createElement("span");
			placeholder.setAttribute("data-tp-icon-picker-selected-placeholder", "");
			placeholder.textContent = "Click an icon";

			const icon = document.createElement("tp-icon");
			icon.id = `${idPrefix}-selected-icon`;
			icon.setAttribute("data-tp-icon-picker-selected-icon", "");
			icon.hidden = true;

			preview.append(placeholder, icon);

			const caption = document.createElement("figcaption");
			caption.setAttribute("data-tp-icon-picker-selected-caption", "");

			figure.append(title, preview, caption);
			const count = this.querySelector("[data-tp-icon-picker-count]");
			this.insertBefore(figure, count);
		}

		this.selectedPreviewElement = figure.querySelector<HTMLElement>(
			"[data-tp-icon-picker-selected-preview]",
		);
		this.selectedIconElement = figure.querySelector<HTMLElement>(
			"tp-icon[data-tp-icon-picker-selected-icon]",
		);
	}

	/**
	 * Renders the last clicked icon at a larger size.
	 *
	 * @summary Updates selected icon visualization.
	 * @internal
	 */
	private renderSelectedPreview(): void {
		if (!(this.selectedPreviewElement instanceof HTMLElement)) return;

		const caption = this.queryElement<HTMLElement>(
			":scope > figure[data-tp-icon-picker-selected] > figcaption",
		);
		if (this.selectedItem === null) {
			this.selectedIconElement?.removeAttribute("name");
			this.selectedIconElement?.removeAttribute("library");
			if (this.selectedIconElement !== null)
				this.selectedIconElement.hidden = true;
			if (caption !== null) caption.textContent = "";
			return;
		}

		const placeholder = this.selectedPreviewElement.querySelector<HTMLElement>(
			"[data-tp-icon-picker-selected-placeholder]",
		);
		if (placeholder !== null) placeholder.hidden = true;
		if (this.selectedIconElement !== null) {
			this.selectedIconElement.hidden = false;
			this.selectedIconElement.setAttribute("name", this.selectedItem.name);
			this.selectedIconElement.setAttribute(
				"library",
				this.selectedItem.library,
			);
			this.selectedIconElement.setAttribute(
				"aria-label",
				`${this.selectedItem.name} from ${this.selectedItem.library}`,
			);
		}
		if (caption !== null) {
			caption.textContent = `${this.selectedItem.name} — ${this.selectedItem.library}`;
		}
		this.applyIconOptionsToPreviews();
	}

	/**
	 * Updates the code field and visual previews after an option changes.
	 *
	 * @summary Handles icon attribute input.
	 * @internal
	 */
	private readonly onIconOptionInput = (): void => {
		this.syncCopyControls();
		this.applyIconOptionsToPreviews();
	};

	/**
	 * Reads values from the icon attribute controls.
	 *
	 * @summary Returns configured icon presentation options.
	 * @returns Current option values.
	 * @internal
	 */
	private getIconOptions(): TpIconPickerIconOptions {
		return {
			size: this.iconOptionInputs.size?.value.trim() ?? "",
			color: this.iconOptionInputs.color?.value.trim() ?? "",
			scale: this.iconOptionInputs.scale?.value.trim() ?? "",
			rotate: this.iconOptionInputs.rotate?.value.trim() ?? "",
			flipH: this.iconOptionInputs["flip-h"]?.checked ?? false,
			flipV: this.iconOptionInputs["flip-v"]?.checked ?? false,
			spin: this.iconOptionInputs.spin?.checked ?? false,
		};
	}

	/**
	 * Applies configured presentation options only to the selected `<tp-icon>`.
	 *
	 * @summary Refreshes the selected icon preview.
	 * @internal
	 */
	private applyIconOptionsToPreviews(): void {
		const options = this.getIconOptions();
		const icon = this.selectedIconElement;
		if (icon === null) return;

		const setOptionalAttribute = (name: string, value: string): void => {
			if (value === "") icon.removeAttribute(name);
			else icon.setAttribute(name, value);
		};
		setOptionalAttribute("size", options.size);
		setOptionalAttribute("color", options.color);
		setOptionalAttribute("scale", options.scale);
		setOptionalAttribute("rotate", options.rotate);
		icon.toggleAttribute("flip-h", options.flipH);
		icon.toggleAttribute("flip-v", options.flipV);
		icon.toggleAttribute("spin", options.spin);

		if (this.selectedPreviewElement !== null) {
			if (this.selectedItem === null) {
				this.selectedPreviewElement.style.inlineSize = "max-content";
				this.selectedPreviewElement.style.blockSize = "auto";
				return;
			}

			const scale = Number(options.scale);
			const factor = Number.isFinite(scale) && scale > 0 ? scale : 1;
			const dimension = options.size.match(
				/^(-?(?:\d+(?:\.\d+)?|\.\d+))([a-z%]+)$/i,
			);
			const visualSize =
				factor === 1
					? options.size
					: dimension === null
						? `calc((${options.size}) * ${String(factor)})`
						: `${String(Number(dimension[1]) * factor)}${dimension[2] ?? ""}`;
			this.selectedPreviewElement.style.inlineSize = visualSize;
			this.selectedPreviewElement.style.blockSize = visualSize;
		}
	}

	/**
	 * Synchronizes the embedded selector and clipboard preview.
	 *
	 * @summary Refreshes copy controls from component state.
	 * @internal
	 */
	private syncCopyControls(): void {
		const selectedIndex = copyFormatValues.indexOf(this.copy) + 1;
		this.copyFormatElement?.setAttribute("value", String(selectedIndex));

		if (this.copyPreviewElement instanceof HTMLTextAreaElement) {
			this.copyPreviewElement.value =
				this.activeItem === null
					? ""
					: this.getClipboardValue(this.activeItem, this.copy);
		}
	}

	/**
	 * Computes the filtered icon list using current component filters.
	 *
	 * @summary Returns icon entries visible with current filters.
	 * @returns Filtered icon entries.
	 * @internal
	 */
	private getFilteredItems(): TpIconPickerItem[] {
		const text = this.filter.toLowerCase();
		const library = this.library;

		return this.items.filter((item) => {
			if (library !== "all" && item.library !== library) {
				return false;
			}

			if (text === "") {
				return true;
			}

			return (
				item.name.toLowerCase().includes(text) ||
				item.library.toLowerCase().includes(text) ||
				item.sourcePath.toLowerCase().includes(text)
			);
		});
	}

	/**
	 * Returns all known library names from available icon entries.
	 *
	 * @summary Lists available icon library values.
	 * @returns Sorted library names.
	 * @internal
	 */
	private getLibraries(): string[] {
		return Array.from(new Set(this.items.map((item) => item.library))).sort(
			(a, b) => a.localeCompare(b),
		);
	}

	/**
	 * Re-renders select options, counters, and icon item cards.
	 *
	 * @summary Renders the icon picker UI from current state.
	 * @internal
	 */
	private render(): void {
		if (
			!(this.librarySelect instanceof HTMLSelectElement) ||
			!(this.searchInput instanceof HTMLInputElement) ||
			!(this.gridElement instanceof HTMLElement) ||
			!(this.countElement instanceof HTMLElement)
		) {
			return;
		}

		const libraries = this.getLibraries();
		this.renderLibraryOptions(libraries);

		this.searchInput.value = this.filter;
		this.librarySelect.value = libraries.includes(this.library)
			? this.library
			: "all";

		const visibleItems = this.getFilteredItems();
		this.activeItem =
			visibleItems.find((item) => item.id === this.activeItem?.id) ??
			visibleItems[0] ??
			null;
		this.syncCopyControls();
		this.countElement.textContent = `${visibleItems.length} icon${visibleItems.length > 1 ? "s" : ""}`;

		const fragment = document.createDocumentFragment();
		for (const item of visibleItems) {
			fragment.append(this.createItemButton(item));
		}

		this.gridElement.replaceChildren(fragment);
		this.applyIconOptionsToPreviews();
	}

	/**
	 * Renders library options in the select control.
	 *
	 * @summary Updates library filter select options.
	 * @param libraries Available library names.
	 * @internal
	 */
	private renderLibraryOptions(libraries: string[]): void {
		if (!(this.librarySelect instanceof HTMLSelectElement)) {
			return;
		}

		const values = ["all", ...libraries];
		const hasSameOptions =
			this.librarySelect.options.length === values.length &&
			values.every(
				(value, index) =>
					this.librarySelect?.options.item(index)?.value === value,
			);

		if (hasSameOptions) {
			return;
		}

		const fragment = document.createDocumentFragment();
		for (const value of values) {
			const option = document.createElement("option");
			option.value = value;
			option.textContent = value === "all" ? "All libraries" : value;
			fragment.append(option);
		}

		this.librarySelect.replaceChildren(fragment);
	}

	/**
	 * Creates one clickable icon item card.
	 *
	 * @summary Builds one grid item for an icon entry.
	 * @param item Icon entry to render.
	 * @returns Clickable button representing the icon.
	 * @internal
	 */
	private createItemButton(item: TpIconPickerItem): HTMLButtonElement {
		const button = document.createElement("button");
		button.type = "button";
		button.setAttribute("data-tp-icon-picker-item", "");
		button.classList.add("tp-ivory");
		button.dataset.library = item.library;
		button.dataset.name = item.name;
		button.setAttribute("aria-label", `${item.name} from ${item.library}`);

		const preview = document.createElement("span");
		preview.setAttribute("data-tp-icon-picker-preview", "");
		preview.innerHTML = namespaceSvgIds(
			item.svg,
			`tp-icon-picker-${toSvgIdPrefix(item.id)}`,
		);

		const name = document.createElement("code");
		name.setAttribute("data-tp-icon-picker-name", "");
		name.textContent = item.name;

		const library = document.createElement("span");
		library.setAttribute("data-tp-icon-picker-library-name", "");
		library.textContent = item.library;

		button.append(preview, name, library);
		const showClipboardPreview = (): void => {
			this.activeItem = item;
			this.syncCopyControls();
		};
		button.addEventListener("pointerenter", showClipboardPreview);
		button.addEventListener("focus", showClipboardPreview);
		button.addEventListener("click", () => {
			showClipboardPreview();
			this.selectedItem = item;
			if (this.compactSelectedIconElement !== null) {
				this.compactSelectedIconElement.innerHTML = namespaceSvgIds(
					item.svg,
					`tp-icon-picker-compact-${toSvgIdPrefix(item.id)}`,
				);
				this.compactSelectedIconElement.title = `${item.name} — ${item.library}`;
			}
			this.renderSelectedPreview();
			const format = this.copy;
			const value = this.getClipboardValue(item, format);
			void this.copyToClipboard(item, format, value);
			this.dispatchEvent(
				new CustomEvent("tp-icon-picker-select", {
					bubbles: true,
					composed: true,
					detail: {
						name: item.name,
						library: item.library,
						sourcePath: item.sourcePath,
						format,
						value,
					},
				}),
			);
		});

		return button;
	}

	/**
	 * Builds the clipboard value for an icon and format.
	 *
	 * @summary Serializes an icon for clipboard output.
	 * @param item Selected icon.
	 * @param format Requested output format.
	 * @returns Text to copy.
	 * @internal
	 */
	private getClipboardValue(
		item: TpIconPickerItem,
		format: TpIconPickerCopyFormat,
	): string {
		const name = escapeHtmlAttribute(item.name);
		const library =
			item.library === "tp"
				? ""
				: ` library="${escapeHtmlAttribute(item.library)}"`;
		const options = this.getIconOptions();
		const iconAttributes = [
			options.size === "" ? "" : ` size="${escapeHtmlAttribute(options.size)}"`,
			options.color === ""
				? ""
				: ` color="${escapeHtmlAttribute(options.color)}"`,
			options.scale === ""
				? ""
				: ` scale="${escapeHtmlAttribute(options.scale)}"`,
			options.rotate === ""
				? ""
				: ` rotate="${escapeHtmlAttribute(options.rotate)}"`,
			options.flipH ? " flip-h" : "",
			options.flipV ? " flip-v" : "",
			options.spin ? " spin" : "",
		].join("");
		const iconButtonAttributes = [
			options.color === ""
				? ""
				: ` color="${escapeHtmlAttribute(options.color)}"`,
			options.scale === ""
				? ""
				: ` scale="${escapeHtmlAttribute(options.scale)}"`,
			options.rotate === ""
				? ""
				: ` rotate="${escapeHtmlAttribute(options.rotate)}"`,
			options.flipH ? " flip-h" : "",
			options.flipV ? " flip-v" : "",
			options.spin ? " spin" : "",
		].join("");

		switch (format) {
			case "svg":
				return item.svg.trim();
			case "tp-icon":
				return `<tp-icon name="${name}"${library}${iconAttributes}></tp-icon>`;
			case "tp-icon-button":
				return `<tp-icon-button name="${name}"${library}${iconButtonAttributes}></tp-icon-button>`;
			case "img": {
				const source =
					item.library === "tp"
						? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(item.svg.trim())}`
						: item.sourcePath;
				return `<img src="${escapeHtmlAttribute(source)}" alt="${name} from ${escapeHtmlAttribute(item.library)}" />`;
			}
			case "name":
			default:
				return item.name;
		}
	}

	/**
	 * Copies the selected icon representation when supported.
	 *
	 * @summary Copies the selected icon to clipboard.
	 * @param item Selected icon.
	 * @param format Clipboard output format.
	 * @param value Text to copy.
	 * @returns Promise resolved when copy attempt completes.
	 * @internal
	 */
	private async copyToClipboard(
		item: TpIconPickerItem,
		format: TpIconPickerCopyFormat,
		value: string,
	): Promise<void> {
		if (typeof navigator === "undefined" || navigator.clipboard === undefined) {
			return;
		}

		try {
			await navigator.clipboard.writeText(value);
		} catch (error) {
			this.dispatchEvent(
				new CustomEvent("tp-icon-picker-copy-error", {
					bubbles: true,
					composed: true,
					detail: {
						name: item.name,
						library: item.library,
						format,
						value,
						error,
					},
				}),
			);
		}
	}
}

if (!customElements.get("tp-icon-picker")) {
	customElements.define("tp-icon-picker", TpIconPicker);
}

declare global {
	interface HTMLElementTagNameMap {
		"tp-icon-picker": TpIconPicker;
	}
}
