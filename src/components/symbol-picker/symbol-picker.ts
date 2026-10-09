/**
 * @module components/symbol-picker
 * @summary HTML named-character symbol picker.
 */

// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-radio-list
 * @summary Transforms a list into a group of radio buttons.
 */
// tp-docgen:dependencies:end

import { TpBase } from "../base/base.js";
import htmlSymbolsData from "./html-symbols.json?raw";
import style from "./symbol-picker.css?inline";
import "../radio-list/radio-list.js";

export type TpSymbolPickerItem = {
	symbol: string;
	name: string;
	group: string;
	entities: string[];
	codepoints: string[];
};

export type TpSymbolPickerMetadata = {
	unicode: string;
	hexadecimalHtml: string;
	decimalHtml: string;
	htmlEntity: string | null;
};

export type TpSymbolPickerCopyFormat =
	| "symbol"
	| "unicode"
	| "hexadecimal-html"
	| "decimal-html"
	| "html-entity";

const copyFormats: TpSymbolPickerCopyFormat[] = [
	"symbol",
	"unicode",
	"hexadecimal-html",
	"decimal-html",
	"html-entity",
];

export function getSymbolMetadata(
	item: TpSymbolPickerItem,
): TpSymbolPickerMetadata {
	const numericCodepoints = item.codepoints.map((value) =>
		Number.parseInt(value, 16),
	);
	return {
		unicode: item.codepoints.map((value) => `U+${value}`).join(" "),
		hexadecimalHtml: item.codepoints.map((value) => `&#x${value};`).join(""),
		decimalHtml: numericCodepoints
			.map((value) => `&#${String(value)};`)
			.join(""),
		htmlEntity: item.entities[0] ?? null,
	};
}

export function parseHtmlSymbols(source: string): TpSymbolPickerItem[] {
	return JSON.parse(source) as TpSymbolPickerItem[];
}

/**
 * `<tp-symbol-picker>` browses and copies HTML5 named character references.
 *
 * @summary HTML5 symbol picker.
 * @tagname tp-symbol-picker
 * @attr {string} filter = "" - Free-text filter applied to symbol names and metadata.
 * @attr {string} group = "all" - Active symbol group (`all` by default).
 * @attr {string} copy = "symbol" - Clipboard format: `symbol`, `unicode`, `hexadecimal-html`, `decimal-html`, or `html-entity`.
 * @attr {boolean} compact = false - Shows only the title, filters, and a compact 2em symbol grid.
 * @event tp-symbol-picker-select Emitted after a symbol is selected and copied.
 * @event tp-symbol-picker-copy-error Emitted when the clipboard rejects a copy operation.
 * @example
 * <tp-symbol-picker></tp-symbol-picker>
 */
export class TpSymbolPicker extends TpBase {
	private static readonly styleId = "tp-symbol-picker-styles";
	private static nextId = 0;

	private readonly items = parseHtmlSymbols(htmlSymbolsData);
	private searchInput: HTMLInputElement | null = null;
	private groupSelect: HTMLSelectElement | null = null;
	private countElement: HTMLElement | null = null;
	private gridElement: HTMLElement | null = null;
	private selectedSymbolElement: HTMLElement | null = null;
	private compactSelectedSymbolElement: HTMLElement | null = null;
	private selectedNameElement: HTMLElement | null = null;
	private selectedMetadataElements: Record<
		keyof TpSymbolPickerMetadata,
		HTMLElement
	> | null = null;
	private copyFormatElement: HTMLElement | null = null;

	public static get observedAttributes(): string[] {
		return ["filter", "group", "copy"];
	}

	public get filter(): string {
		return this.getStringAttribute("filter", "");
	}

	public set filter(value: string) {
		this.setStringAttribute("filter", value.trim());
	}

	public get group(): string {
		return this.getStringAttribute("group", "all");
	}

	public set group(value: string) {
		this.setStringAttribute(
			"group",
			value.trim() === "" ? "all" : value.trim(),
		);
	}

	public get compact(): boolean {
		return this.getBooleanAttribute("compact");
	}

	public set compact(value: boolean) {
		this.setBooleanAttribute("compact", value);
	}

	public get copy(): TpSymbolPickerCopyFormat {
		const value = this.getStringAttribute("copy", "symbol");
		return copyFormats.includes(value as TpSymbolPickerCopyFormat)
			? (value as TpSymbolPickerCopyFormat)
			: "symbol";
	}

	public set copy(value: TpSymbolPickerCopyFormat) {
		this.setStringAttribute("copy", value);
	}

	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle(TpSymbolPicker.styleId, style);
		this.ensureStructure();
		this.render();
	}

	protected override attributeChangedCallback(
		_name: string,
		oldValue: string | null,
		newValue: string | null,
	): void {
		if (oldValue !== newValue && this.isConnected) this.render();
	}

	private ensureStructure(): void {
		if (this.hasAttribute("data-tp-symbol-picker-ready")) return;
		this.setAttribute("data-tp-symbol-picker-ready", "");
		TpSymbolPicker.nextId += 1;
		const id = `tp-symbol-picker-${String(TpSymbolPicker.nextId)}`;

		const heading = document.createElement("div");
		heading.setAttribute("data-tp-symbol-picker-heading", "");
		heading.innerHTML =
			"<strong>Symbol picker</strong><span>HTML5 named entities</span>";
		const compactSelectedSymbol = document.createElement("output");
		compactSelectedSymbol.setAttribute(
			"data-tp-symbol-picker-compact-selected",
			"",
		);
		compactSelectedSymbol.setAttribute("aria-label", "Selected symbol");
		heading.append(compactSelectedSymbol);

		const controls = document.createElement("div");
		controls.setAttribute("data-tp-symbol-picker-controls", "");
		const searchLabel = document.createElement("label");
		searchLabel.htmlFor = `${id}-search`;
		searchLabel.textContent = "Filter";
		const searchField = document.createElement("div");
		searchField.setAttribute("data-tp-symbol-picker-field", "filter");
		const search = document.createElement("input");
		search.id = `${id}-search`;
		search.type = "search";
		search.placeholder = "Search symbol";
		search.setAttribute("data-tp-symbol-picker-search", "");
		search.addEventListener("input", () => {
			this.filter = search.value;
		});
		const groupLabel = document.createElement("label");
		groupLabel.htmlFor = `${id}-group`;
		groupLabel.textContent = "Group";
		const groupSelect = document.createElement("select");
		groupSelect.id = `${id}-group`;
		groupSelect.setAttribute("data-tp-symbol-picker-group", "");
		groupSelect.addEventListener("change", () => {
			this.group = groupSelect.value;
		});
		const groupField = document.createElement("div");
		groupField.setAttribute("data-tp-symbol-picker-field", "group");
		searchField.append(searchLabel, search);
		groupField.append(groupLabel, groupSelect);
		controls.append(searchField, groupField);

		const copyControls = document.createElement("fieldset");
		copyControls.setAttribute("data-tp-symbol-picker-copy-controls", "");
		const copyLegend = document.createElement("legend");
		copyLegend.textContent = "Copy as";
		const copyFormat = document.createElement("tp-radio-list");
		copyFormat.setAttribute("data-tp-symbol-picker-copy-format", "");
		copyFormat.setAttribute("name", `${id}-copy`);
		copyFormat.setAttribute("orientation", "horizontal");
		copyFormat.innerHTML = `
      <ul>
        <li>Symbol</li>
        <li>Unicode</li>
        <li>Hexa code</li>
        <li>HTML code</li>
        <li>HTML entity</li>
      </ul>
    `;
		copyFormat.addEventListener("tp-radio-list-change", (event) => {
			const value =
				(event as CustomEvent<{ value?: string }>).detail?.value ?? "1";
			this.copy = copyFormats[Number(value) - 1] ?? "symbol";
		});
		copyControls.append(copyLegend, copyFormat);

		const selected = document.createElement("figure");
		selected.setAttribute("data-tp-symbol-picker-selected", "");
		const selectedSymbol = document.createElement("output");
		selectedSymbol.setAttribute("data-tp-symbol-picker-selected-symbol", "");
		selectedSymbol.textContent = "∞";
		const selectedName = document.createElement("figcaption");
		selectedName.setAttribute("data-tp-symbol-picker-selected-name", "");
		selectedName.textContent = "Click a symbol to copy it";
		const metadata = document.createElement("dl");
		metadata.setAttribute("data-tp-symbol-picker-metadata", "");
		const metadataElements = {} as Record<
			keyof TpSymbolPickerMetadata,
			HTMLElement
		>;
		const definitions: Array<[keyof TpSymbolPickerMetadata, string]> = [
			["unicode", "Unicode"],
			["hexadecimalHtml", "Hexa code"],
			["decimalHtml", "HTML code"],
			["htmlEntity", "HTML entity"],
		];
		for (const [key, label] of definitions) {
			const term = document.createElement("dt");
			term.textContent = label;
			const description = document.createElement("dd");
			const code = document.createElement("code");
			code.textContent = "None";
			description.append(code);
			metadata.append(term, description);
			metadataElements[key] = code;
		}
		selected.append(selectedSymbol, selectedName, metadata);

		const count = document.createElement("p");
		count.setAttribute("data-tp-symbol-picker-count", "");
		const grid = document.createElement("div");
		grid.setAttribute("data-tp-symbol-picker-grid", "");

		this.append(heading, controls, copyControls, selected, count, grid);
		this.searchInput = search;
		this.groupSelect = groupSelect;
		this.copyFormatElement = copyFormat;
		this.selectedSymbolElement = selectedSymbol;
		this.compactSelectedSymbolElement = compactSelectedSymbol;
		this.selectedNameElement = selectedName;
		this.selectedMetadataElements = metadataElements;
		this.countElement = count;
		this.gridElement = grid;
	}

	private getFilteredItems(): TpSymbolPickerItem[] {
		const filter = this.filter.toLocaleLowerCase("en");
		return this.items.filter((item) => {
			if (this.group !== "all" && item.group !== this.group) return false;
			if (filter === "") return true;
			return [
				item.symbol,
				item.name,
				item.group,
				item.entities.join(" "),
				item.codepoints.join(" "),
			].some((value) => value.toLocaleLowerCase("en").includes(filter));
		});
	}

	private render(): void {
		if (
			this.searchInput === null ||
			this.groupSelect === null ||
			this.countElement === null ||
			this.gridElement === null
		)
			return;

		const groups = Array.from(new Set(this.items.map((item) => item.group)));
		const options = ["all", ...groups];
		this.groupSelect.replaceChildren(
			...options.map((value) => {
				const option = document.createElement("option");
				option.value = value;
				option.textContent = value === "all" ? "All groups" : value;
				return option;
			}),
		);
		this.searchInput.value = this.filter;
		this.groupSelect.value = groups.includes(this.group) ? this.group : "all";
		this.copyFormatElement?.setAttribute(
			"value",
			String(copyFormats.indexOf(this.copy) + 1),
		);

		const items = this.getFilteredItems();
		this.countElement.textContent = `${String(items.length)} ${items.length === 1 ? "symbol" : "symbols"}`;
		const fragment = document.createDocumentFragment();
		for (const item of items) {
			const button = document.createElement("button");
			button.type = "button";
			button.setAttribute("data-tp-symbol-picker-item", "");
			button.dataset.symbol = item.symbol;
			button.dataset.name = item.name;
			button.title = `${item.name} — ${item.entities.join(", ")}`;
			button.setAttribute("aria-label", item.name);
			const glyph = document.createElement("span");
			glyph.setAttribute("data-tp-symbol-picker-glyph", "");
			glyph.textContent = item.symbol;
			const name = document.createElement("span");
			name.setAttribute("data-tp-symbol-picker-name", "");
			name.textContent = item.name;
			button.append(glyph, name);
			button.addEventListener("click", () => {
				this.selectItem(item);
			});
			fragment.append(button);
		}
		this.gridElement.replaceChildren(fragment);
	}

	private selectItem(item: TpSymbolPickerItem): void {
		const metadata = getSymbolMetadata(item);
		if (this.selectedSymbolElement !== null)
			this.selectedSymbolElement.textContent = item.symbol;
		if (this.compactSelectedSymbolElement !== null) {
			this.compactSelectedSymbolElement.textContent = item.symbol;
			this.compactSelectedSymbolElement.title = item.name;
		}
		if (this.selectedNameElement !== null) {
			const description = document.createElement("span");
			description.textContent = `${item.name} — ${item.group}`;
			const aliases = document.createElement("span");
			aliases.setAttribute("data-tp-symbol-picker-aliases", "");
			for (const entity of item.entities) {
				const code = document.createElement("code");
				code.textContent = entity;
				aliases.append(code);
			}
			this.selectedNameElement.replaceChildren(description, aliases);
		}
		if (this.selectedMetadataElements !== null) {
			this.selectedMetadataElements.unicode.textContent = metadata.unicode;
			this.selectedMetadataElements.hexadecimalHtml.textContent =
				metadata.hexadecimalHtml;
			this.selectedMetadataElements.decimalHtml.textContent =
				metadata.decimalHtml;
			this.selectedMetadataElements.htmlEntity.textContent =
				metadata.htmlEntity ?? "None";
		}

		const clipboardValue = this.getClipboardValue(item, metadata);
		if (navigator.clipboard !== undefined && clipboardValue !== null) {
			void navigator.clipboard
				.writeText(clipboardValue)
				.catch((error: unknown) => {
					this.dispatchEvent(
						new CustomEvent("tp-symbol-picker-copy-error", {
							bubbles: true,
							composed: true,
							detail: {
								...item,
								copy: this.copy,
								value: clipboardValue,
								error,
							},
						}),
					);
				});
		}

		this.dispatchEvent(
			new CustomEvent("tp-symbol-picker-select", {
				bubbles: true,
				composed: true,
				detail: { ...item, copy: this.copy, value: clipboardValue },
			}),
		);
	}

	private getClipboardValue(
		item: TpSymbolPickerItem,
		metadata = getSymbolMetadata(item),
	): string | null {
		switch (this.copy) {
			case "unicode":
				return metadata.unicode;
			case "hexadecimal-html":
				return metadata.hexadecimalHtml;
			case "decimal-html":
				return metadata.decimalHtml;
			case "html-entity":
				return metadata.htmlEntity;
			default:
				return item.symbol;
		}
	}
}

if (!customElements.get("tp-symbol-picker")) {
	customElements.define("tp-symbol-picker", TpSymbolPicker);
}

declare global {
	interface HTMLElementTagNameMap {
		"tp-symbol-picker": TpSymbolPicker;
	}
}
